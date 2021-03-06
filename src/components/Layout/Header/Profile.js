/**
 * @function Profile - Dropdown for profile settings and actions
 *
 * @param {object} currentUser - should contains at least FirstName
 * @param {object} [userOrdersSummary] - data regarding the rejected/pending orders of the user in an approval process of the store
 */

import React, { Component } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import SignOut from './SignOut'
import SignIn from './SignIn'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import './Profile.scss'
import { Link } from '$routes'
import themeContext from '$ustoreinternal/services/themeContext'
import { t } from '$themelocalization'
import Icon from '$core-components/Icon'
import { redirectToLegacy } from '$ustoreinternal/services/initialLoad'
import { UStoreProvider } from "@ustore/core";
import { deleteCookie } from '$ustoreinternal/services/utils'

const createLink = (anonymous, loginURL, pageTitle, additional) => {
  const { languageCode } = themeContext.get()
  const pageURL = urlGenerator.get({ page: pageTitle })

  if (anonymous) {
    return `${loginURL}&returnNGURL=/${encodeURIComponent(pageURL.slice(pageURL.indexOf(languageCode)))}${additional ? '?' + additional : ''}`
  }

  return `${pageURL}${additional ? '?' + additional : ''}`
}

const getLinkComponent = (pageName, IsAnonymous, loginPage, pageTitle, additional) => {
  return IsAnonymous ?
    <DropdownItem tag="a" onClick={() => { redirectToLegacy(null, createLink(IsAnonymous, loginPage, pageTitle, additional)) }}>{pageName}</DropdownItem>
    :
    <Link to={createLink(IsAnonymous, loginPage, pageTitle, additional)}>
      <DropdownItem tag="a">{pageName}</DropdownItem>
    </Link>
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isDropdownOpen: false
    }
  }

  toggle() {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }))
  }

  goToUrl = () => {
    console.log("HER")
    const { storeID, classicUrl, securityToken, storeFriendlyID, languageCode, userID, showThemeAsDraft } = themeContext.get()
    const userIDfromStore = UStoreProvider.state.get().currentUser.ID
    const tempUserId = (!userID || (userIDfromStore && userIDfromStore !== userID)) ? userIDfromStore : userID
    const isDraft = showThemeAsDraft && showThemeAsDraft.toLowerCase() === 'true'
    const pageURL = window.location.href
    deleteCookie('_token')
    window.location.href = `${classicUrl}/logout.aspx?SecurityToken=${securityToken}&StoreGuid=${storeID}&storeid=${storeFriendlyID}&NgLanguageCode=${languageCode}&forceLogin=true&SignIn=true&ShowRibbon=false${isDraft ? '&showThemeAsDraft=true' : ''}&tempUserId=${tempUserId}&returnNGURL=/${encodeURIComponent(pageURL.slice(pageURL.indexOf(languageCode)))}`
  }


  render() {
    const { currentUser, userOrdersSummary } = this.props
    const { userID, storeID, securityToken, storeFriendlyID, languageCode } = themeContext.get()

    const userIDFromStore = UStoreProvider.state.get().currentUser.ID
    const tempUserId = (!userID || (userIDFromStore && userIDFromStore !== userID)) ? userIDFromStore : userID

    const rejectedOrderCount = (userOrdersSummary) ? userOrdersSummary.RejectedOrderCount : null
    const pendingApprovalOrderCount = (userOrdersSummary) ? userOrdersSummary.PendingApprovalOrderCount : null
    const loginPage = `/logout.aspx?tempUserId=${tempUserId}&SecurityToken=${securityToken}&StoreGuid=${storeID}&storeid=${storeFriendlyID}&NgLanguageCode=${languageCode}&forceLogin=true&ShowRibbon=false&SignIn=true`
    const IsAnonymous = currentUser.IsAnonymous

    const userIcon = require(`$assets/images/user-icon.png`)

    return (
      <Dropdown
        isOpen={this.state.isDropdownOpen}
        toggle={this.toggle}
        className="profile"
      >
        <DropdownToggle
          tag='div'
          data-toggle='dropdown'
        >
          <div className="profile-icon-container" onClick={(event) => {
            if (IsAnonymous) {
              this.goToUrl()
              event.stopPropagation();
            }
          }}>
            {userIcon && <img className="user-icon" src={userIcon} alt="user-icon" />}
          </div>
        </DropdownToggle>
        <DropdownMenu right>
          {
            IsAnonymous
              ? <SignIn />
              : <SignOut currentUser={currentUser} />
          }
          <div className="dd-body">

            {
              getLinkComponent(t('Profile.My_orders'), IsAnonymous, loginPage, 'order-history', 'filter=0')
            }
            {
              userOrdersSummary && currentUser.Roles.Shopper &&
              getLinkComponent(t('Profile.Rejected_orders', { rejectedOrderCount }), IsAnonymous, loginPage, 'order-history', 'filter=2')
            }
            {
              userOrdersSummary && currentUser.Roles.Approver &&
              getLinkComponent(t('Profile.Orders_to_approve', { pendingApprovalOrderCount }), IsAnonymous, loginPage, 'order-approval-list')
            }
            <Link to={urlGenerator.get({ page: 'drafts' })}>
              <DropdownItem tag="a" className="drafts">{t('Profile.Draft_orders')}</DropdownItem>
            </Link>
            {
              getLinkComponent(t('Profile.Recipient_lists'), IsAnonymous, loginPage, 'my-recipient-lists')
            }
            {
              getLinkComponent(t('Profile.Addresses'), IsAnonymous, loginPage, 'addresses')
            }
            {
              getLinkComponent(t('Profile.Personal_information'), IsAnonymous, loginPage, 'personal-information')
            }
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

export default Profile

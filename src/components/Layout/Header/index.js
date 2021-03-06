/**
 * @function Header - contains all the components of the header section
 *
 * @param {object} categoriesTree - a list of CategoryTreeNodeModel. Each node should contain:
 * 		Category {object} - CategoryModel
 * 		SubCategories {object} - list of CategoryTreeNodeModel
 * @param {object} currencies - all currencies - should contain:
 *    ID {string} - unique currency id
 *    Symbol {string} - the currency character
 *    Code {string} - the currency name
 * @param {object} currentCurrency - the selected currency - should contain:
 *    ID {string} - unique currency id
 *    Symbol {string} - the currency character
 *    Code {string} - the currency name
 * @param {object} cultures - all cultures - should contain:
 *    ID {string} - unique culture id
 *    Flag {string} - the flag file name
 *    DisplayName {string} - the language name
 * @param currentCulture - the selected culture - should contain:
 *    ID {string} - unique culture id
 *    Flag {string} - the flag file name
 *    DisplayName {string} - the language name
 * @param currentUser - should contains at least FirstName
 */

import React, { Component } from 'react'
import CategoriesSidebar from './CategoriesSidebar'
import Profile from './Profile'
import Overlay from '$core-components/Overlay'
import Cart from "./Cart"
import './Header.scss'
import { Router, Link } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { setCookie, isServer } from "$ustoreinternal/services/utils";
import Icon from '$core-components/Icon'
import { mobileSize } from '../../consts'

class Header extends Component {
  constructor() {
    super();

    this.state = {
      drawerOpen: false,						    // Left drawer - opened/closed
      pageURL: '',
      mobile: false,
      overlayActive: false,	  			    // The overlay - active or not
    }
  }

  componentDidMount() {
    this.setState({ pageURL: this.getCurrentURL() })
    setCookie('_cookieRibbonNotShownYet', 0)
    const mobileStatus = window.innerWidth < mobileSize
    if (mobileStatus != this.state.mobile) {
      this.setState({ mobile: mobileStatus })
    }
    window.addEventListener('resize', () => this.handleResize(this.state.mobile));
  }
  handleResize() {
    if (window.innerWidth >= mobileSize && this.state.mobile == true)
      this.setState({ mobile: false })
    if (window.innerWidth < mobileSize && this.state.mobile == false) {
      this.setState({ mobile: true })
    }
  }

  componentDidUpdate() {
    if (this.state.pageURL != this.getCurrentURL()) this.setState({ pageURL: this.getCurrentURL() })
  }

  getCurrentURL() {
    if (window.location.href.includes('home')) return 'home'
    if (window.location.href.includes('Poster')) return 'Poster'
    if (window.location.href.includes('FlyerA5')) return 'FlyerA5'
    if (window.location.href.includes('FlyerA4')) return 'FlyerA4'
    if (window.location.href.endsWith('he-IL/')) return 'home'
  }
  drawerStateChange(open) {
    this.setState({ drawerOpen: open })
    this.setState({ overlayActive: open })

    if (open) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'auto'
    }
  }

  burgerClicked() {
    this.drawerStateChange(true)
  }

  overlayClicked() {
    this.drawerStateChange(false)
  }

  render() {
    if (!this.props.customState) {
      return null
    }

    const sidebarRedirect = (pageParams) => {
      this.drawerStateChange(false)
      Router.pushRoute(urlGenerator.get(pageParams))
    }

    const { customState: { categoriesTree, userOrdersSummary }, currencies, cultures, currentCulture, currentUser, currentCurrency } = this.props
    const currentLogo = require(`$assets/images/logo.png`)

    return (
      <div className='header' >
        <div className='header-stripe' draweropen={`${this.state.drawerOpen}`}>
          <div className='wrapper'>
            {!this.state.mobile && <div className="logo-wrapper">
              <Link to={urlGenerator.get({ page: 'pages', id: 'home' })}>
                <a>
                  <div className="logo-container">
                    {currentLogo && <img className="logo" src={currentLogo} alt="logo" />}
                  </div>
                </a>
              </Link>
            </div>}
            {this.state.mobile && <div className="logo-wrapper-mobile">
              <div className="menu-icon-container" onClick={this.burgerClicked.bind(this)}>
                <Icon name="menu.svg" width="23px" height="20px" className="menu-icon" />
              </div>
              <Link to={urlGenerator.get({ page: 'pages', id: 'home' })}>
                <a>
                  <div className="logo-container-mobile">
                    {currentLogo && <img className="logo-mobile" src={currentLogo} alt="logo" />}
                  </div>
                </a>
              </Link>
            </div>}
            <div className="left-icons">
              <Link to={urlGenerator.get({ page: 'pages', id: 'home' })}>
                <a id="homeLink" className={this.state.pageURL == 'home' ? "link_top active_top" : 'link_top'}>
                  ???? ????????</a>
              </Link>

              <div className="separator" />

              <Link to={urlGenerator.get({ page: 'pages', id: 'Poster' })}>
                <a id="posterLink" className={this.state.pageURL == 'Poster' ? "link_top active_top" : 'link_top'}>
                  ??????????</a>
              </Link>
              <div className="separator" />

              <Link to={urlGenerator.get({ page: 'pages', id: 'FlyerA5' })}>
                <a id="flyerLink" className={this.state.pageURL == 'FlyerA5' ? "link_top active_top" : 'link_top'}>
                  ?????????? A5</a>
              </Link>
              <div className="separator" />

              <Link to={urlGenerator.get({ page: 'pages', id: 'FlyerA4' })}>
                <a id="flyerLink" className={this.state.pageURL == 'FlyerA4' ? "link_top active_top" : 'link_top'}>
                  ?????????? A4</a>
              </Link>

            </div>


            <div className="right-icons">
              {!this.state.mobile && <Link to={urlGenerator.get({ page: 'pages', id: 'Contact' })}>
                <a id="" className="link_top">
                  ?????? ??????</a>
              </Link>}

              {!this.state.mobile && <div className="separator" />}

              {currentUser && <Profile currentUser={currentUser} userOrdersSummary={userOrdersSummary} />}

              <div className="separator" />

              <Cart />

            </div>
          </div>

          <div className="drawer-wrapper">
            {
              categoriesTree && categoriesTree.length > 0 &&
              <CategoriesSidebar onRedirect={sidebarRedirect} onClose={() => this.drawerStateChange(false)} />
            }
          </div>
          <Overlay isActive={this.state.overlayActive} overlayClicked={this.overlayClicked.bind(this)} />


        </div>
      </div >

    )
  }
}

export default Header

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
import { throttle } from 'throttle-debounce'
import { UStoreProvider } from '@ustore/core'
import Profile from './Profile'
import Cart from "./Cart"
import './Header.scss'
import { Router, Link } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'
import { setCookie, isServer } from "$ustoreinternal/services/utils";
import { getVariableValue } from "$ustoreinternal/services/cssVariables";
import theme from '$styles/_theme.scss'
import themeContext from '$ustoreinternal/services/themeContext'

class Header extends Component {
  constructor() {
    super();
    this.header = React.createRef();		// A reference to the main wrapper element

    this.state = {
      drawerOpen: false,						    // Left drawer - opened/closed
      overlayActive: false,	  			    // The overlay - active or not
      logoImageUrl: require(`$assets/images/logo.png`),
      connectCartUrl: '',
      pageURL: ''
    }
  }

  componentDidMount() {
    this.setState({ pageURL: this.getCurrentURL() })

    window.addEventListener('resize', this.onResize);
    throttle(250, this.onResize);					// Call this function once in 250ms only
    setCookie('_cookieRibbonNotShownYet', 0)
    const { currentStore } = this.props
    const { cartUrl } = themeContext.get()
    const connectCartUrl = (currentStore && currentStore.StoreType === 3 && cartUrl) ? cartUrl : ''
    if (this.state.connectCartUrl !== connectCartUrl) this.setState({ connectCartUrl })
  }

  getCurrentURL() {
    if (window.location.href.includes('home')) return 'home'
    if (window.location.href.includes('Poster')) return 'Poster'
    if (window.location.href.includes('Flyer')) return 'Flyer'
  }

  componentDidUpdate() {
    if (this.state.pageURL != this.getCurrentURL()) this.setState({ pageURL: this.getCurrentURL() })
    const { currentStore } = this.props
    const { cartUrl } = themeContext.get()
    const connectCartUrl = (currentStore && currentStore.StoreType === 3 && cartUrl) ? cartUrl : ''

    if (this.state.connectCartUrl !== connectCartUrl) this.setState({ connectCartUrl })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  // NOTE: this is not supported in SSR
  setLogoImage = () => {
    const variableForLogoImg = window.matchMedia(`(min-width: ${theme.lg})`).matches ? '--logo-image' : '--logo-image-mobile'
    this.setState({ logoImageUrl: getVariableValue(variableForLogoImg, require(`$assets/images/logo.png`), true) })
  }

  onResize = () => {
    this.setLogoImage()
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

  getFlagFromCode(languageCode) {
    return `${languageCode}.svg`
  }

  render() {
    if (!this.props.customState) {
      return null
    }

    const { customState: { categoriesTree, userOrdersSummary }, currencies, cultures, currentCulture, currentUser, currentCurrency } = this.props

    const variableForLogoImg = isServer() ? '--logo-image' : window.matchMedia(`(min-width: ${theme.lg})`).matches ? '--logo-image' : '--logo-image-mobile'
    const currentLogo = require(`$assets/images/logo.png`)

    return (
      <div className='header' >
        <div className='header-stripe' ref={(ref) => this.header = ref} draweropen={`${this.state.drawerOpen}`}>
          <div className='wrapper'>

            <div className="logo-wrapper">
              <Link to={urlGenerator.get({ page: 'home' })}>
                <a>
                  <div className="logo-container">
                    {currentLogo && <img className="logo" src={currentLogo} alt="logo" />}
                  </div>
                </a>
              </Link>
            </div>

            <div className="left-icons">
              <Link to={urlGenerator.get({ page: 'home' })}>
                <a id="homeLink" className={this.state.pageURL == 'home' ? "link_top active_top" : 'link_top'}>
                  דף הבית</a>
              </Link>

              <div className="separator" />

              <Link to={urlGenerator.get({ page: 'Poster' })}>
                <a id="posterLink" className={this.state.pageURL == 'Poster' ? "link_top active_top" : 'link_top'}>
                  פוסטר</a>
              </Link>
              <div className="separator" />

              <Link to={urlGenerator.get({ page: 'Flyer' })}>
                <a id="flyerLink" className={this.state.pageURL == 'Flyer' ? "link_top active_top" : 'link_top'}>
                  פלייר</a>
              </Link>

            </div>


            <div className="right-icons">
              <Link to={urlGenerator.get({ page: 'Contact' })}>
                <a id="" className="link_top">
                  צרו קשר</a>
              </Link>

              <div className="separator" />

              {currentUser && <Profile currentUser={currentUser} userOrdersSummary={userOrdersSummary} />}

              <div className="separator" />

              <Cart />

            </div>
          </div>
        </div>
      </div >

    )
  }
}

export default Header

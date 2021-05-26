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
      connectCartUrl: ''
    }
  }

  componentDidMount() {
    // const { currentStore } = this.props
    // document.title = document && document.title && currentStore ? currentStore.Name : '';

    window.addEventListener('resize', this.onResize);
    throttle(250, this.onResize);					// Call this function once in 250ms only

    setCookie('_cookieRibbonNotShownYet', 0)

    const { currentStore } = this.props
    const { cartUrl } = themeContext.get()

    const connectCartUrl = (currentStore && currentStore.StoreType === 3 && cartUrl) ? cartUrl : ''

    if (this.state.connectCartUrl !== connectCartUrl) this.setState({ connectCartUrl })
  }

  componentDidUpdate() {
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

    const currenciesViewModel = currencies && currencies.map(({ ID, Symbol, Code }) => ({
      ID, sign: Symbol, value: Code
    }))

    const culturesViewModel = cultures && cultures.map(({ ID, CountryCode, Name }) => ({
      ID, icon: this.getFlagFromCode(CountryCode), value: Name
    }))

    const currencySelected = (selected) => {
      const selectedCurrency = currencies.find(i => i.ID === selected)
      UStoreProvider.state.culture.setCurrentCurrency(selectedCurrency)
      themeContext.set('currencyFriendlyID', selectedCurrency.FriendlyID)
      setCookie('_currencyID', selectedCurrency.FriendlyID)
      legacyIframeHandler.postMessage({
        type: '@CHANGE_CURRENCY',
        data: selectedCurrency.FriendlyID
      })
    }

    const cultureSelected = (selected) => {
      const selectedCulture = cultures.find(i => i.ID === selected)
      const pathWithNewLangugageCode = window.location.pathname.replace(/\/[a-z]{2}-[A-Za-z]{2}\//, `/${selectedCulture.LanguageCode}/`)
      const searchString = window.location.search
      const hashString = window.location.hash
      window.location.replace(pathWithNewLangugageCode + searchString + hashString)
    }

    const sidebarRedirect = (pageParams) => {
      this.drawerStateChange(false)
      Router.pushRoute(urlGenerator.get(pageParams))
    }

    const variableForLogoImg = isServer() ? '--logo-image' : window.matchMedia(`(min-width: ${theme.lg})`).matches ? '--logo-image' : '--logo-image-mobile'
    const currentLogo = require(`$assets/images/logo.png`)
    const sep = require(`$assets/images/top_sep.png`)

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
            <div className="right-icons">
              <Link to={urlGenerator.get({ page: 'Contact' })}>
                <a id="contact_btn">
                  צרו קשר</a>
              </Link>
              {sep && <img src={sep} className="top_sep" id="middle_sep" alt="Separator" />}
              {currentUser && <Profile currentUser={currentUser} userOrdersSummary={userOrdersSummary} />}

              {sep && <img src={sep} className="top_sep" id="middle_sep" alt="Separator" />}
              <Cart />

            </div>
          </div>
        </div>
      </div >

    )
  }
}

export default Header

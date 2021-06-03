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
import Profile from './Profile'
import Cart from "./Cart"
import './Header.scss'
import { Router, Link } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { setCookie, isServer } from "$ustoreinternal/services/utils";
import theme from '$styles/_theme.scss'

class Header extends Component {
  constructor() {
    super();

    this.state = {
      drawerOpen: false,						    // Left drawer - opened/closed
      pageURL: '',
      mobile: false
    }
  }

  componentDidMount() {
    this.setState({ pageURL: this.getCurrentURL() })
    setCookie('_cookieRibbonNotShownYet', 0)
    const mobileStatus = window.innerWidth < 420
    if (mobileStatus != this.state.mobile) {
      this.setState({ mobile: mobileStatus })
    }
    window.addEventListener('resize', () => this.handleResize(this.state.mobile));
  }
  handleResize() {
    if (window.innerWidth >= 420 && this.state.mobile == true)
      this.setState({ mobile: false })
    if (window.innerWidth < 420 && this.state.mobile == false) {
      this.setState({ mobile: true })
    }
  }

  componentDidUpdate() {
    if (this.state.pageURL != this.getCurrentURL()) this.setState({ pageURL: this.getCurrentURL() })
  }

  getCurrentURL() {
    if (window.location.href.includes('home')) return 'home'
    if (window.location.href.includes('Poster')) return 'Poster'
    if (window.location.href.includes('Flyer')) return 'Flyer'
    if (window.location.href.endsWith('he-IL/')) return 'home'
  }

  render() {
    if (!this.props.customState) {
      return null
    }

    const { customState: { categoriesTree, userOrdersSummary }, currencies, cultures, currentCulture, currentUser, currentCurrency } = this.props

    const currentLogo = require(`$assets/images/logo.png`)

    return (
      <div className='header' >
        <div className='header-stripe' draweropen={`${this.state.drawerOpen}`}>
          <div className='wrapper'>
            {!this.state.mobile && <div className="logo-wrapper">
              <Link to={urlGenerator.get({ page: 'home' })}>
                <a>
                  <div className="logo-container">
                    {currentLogo && <img className="logo" src={currentLogo} alt="logo" />}
                  </div>
                </a>
              </Link>
            </div>}
            {this.state.mobile && <div className="logo-wrapper-mobile">
              <Link to={urlGenerator.get({ page: 'home' })}>
                <a>
                  <div className="logo-container-mobile">
                    {currentLogo && <img className="logo-mobile" src={currentLogo} alt="logo" />}
                  </div>
                </a>
              </Link>
            </div>}
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
              {!this.state.mobile && <Link to={urlGenerator.get({ page: 'Contact' })}>
                <a id="" className="link_top">
                  צרו קשר</a>
              </Link>}

              {!this.state.mobile && <div className="separator" />}

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

/**
 * @function PromotionMain - a component which includes:
 *    Responsive background image
 *    Live text with animation and language localization
 *    Button which navigates to specific product/product list page
 */

import { Router } from '$routes'
import './PromotionMain.scss'
import React, { Component } from "react"
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'

class PromotionMain extends Component {
  constructor() {
    super();
    this.PromotionMain = React.createRef();
  }

  render() {
    const coin_img = require(`$assets/images/coin.png`)
    const main_page_image = require(`$assets/images/main-page-image.png`)

    return (
      <div className={'promotion-main'}>
        <div className="main">
          <div className="title-area">
            <div className="main-text">
              חתכנו את השומן, הגדרנו מראש את המכונה ויצרנו אוטומציה אחת מלאה
                <br />
                התחשבנו רק במה שחשוב - במחיר ובאיכות. נסו אותנו.
              <div className='genral-explanation'>
                <div className='ellipse' />
                איסוף עצמי תוך 24 שעות
                <div className='ellipse' />
                אפשרות למשלוח
                <div className='ellipse' />
                מינימום ₪20 להזמנה
              </div>
            </div>
          </div>
          <center>
            <div className="coin_img">
              {coin_img && <img src={coin_img} className="coin_src" alt="Coin Image" />}
            </div>
            <div className="main_page_image">
              {main_page_image && <img src={main_page_image} alt="Flayer image" />}
            </div>
          </center>
        </div>
      </div>
    )
  }
}
export default PromotionMain

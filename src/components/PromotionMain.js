/**
 * @function PromotionMain - a component which includes:
 *    Responsive background image
 *    Live text with animation and language localization
 *    Button which navigates to specific product/product list page
 */

import './PromotionMain.scss'
import React from 'react'
import { mobileSize } from './consts'

const PromotionMain = () => {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= mobileSize && mobile == true) setMobile(false)
      if (window.innerWidth < mobileSize && mobile == false) setMobile(true)
    }
    window.addEventListener('resize', handleResize)
    const mobileStatus = window.innerWidth < mobileSize
    if (mobileStatus != mobile) setMobile(mobileStatus)
  })

  const coin_img = require(`$assets/images/coin.png`)
  const main_page_image = require(`$assets/images/main-page-image.png`)

  let returnVal = <div className={'promotion-main'}>
    <div className="main">
      <div className="title-area">
        <div className="main-text">
          חתכנו את השומן, הגדרנו מראש את המכונה ויצרנו אוטומציה אחת מלאה.
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
  if (mobile) {
    returnVal = <div className={'promotion-main-mobile'}>
      <div className="main-mobile">
        <div className="title-area-mobile">
          <div className="main-text-mobile">
            חתכנו את השומן, הגדרנו מראש את<br /> המכונה ויצרנו אוטומציה אחת מלאה.
            <br />
            <strong>התחשבנו רק במה שחשוב -<br /> במחיר ובאיכות. נסו אותנו.</strong>
          </div>
          <center>
            <div className="main_page_mobile">
              {main_page_image && <img className="main_page_image_mobile" src={main_page_image} alt="Flayer image" />}
            </div>
          </center>
        </div>
        <div className="subtitle-main-mobile">
          <ul>
            <li>איסוף עצמי תוך 24 שעות</li>
            <li>אפשרות למשלוח</li>
            <li>מינימום ₪20 להזמנה</li>
          </ul>
        </div>
      </div>
    </div>
  }
  return returnVal
}

export default PromotionMain

/**
 * @function PromotionItem - a component which includes:
 *    Responsive background image
 *    Live text with animation and language localization
 *    Button which navigates to specific product/product list page
 *
 * @param {string} imageUrl - the URL of the main background image
 * @param {string} title - the main title
 * @param {string} subTitle - the sub-title
 * @param {string} buttonText - the button's text
 * @param {string} url - the url to redirect to when clicking the button
 */
import { Router } from '$routes'
import './PromotionItem.scss'
import React, { Component } from "react"
import theme from '$styles/_theme.scss'

const handleBuy = () => {
  console.log("Dani was here!")
  import('react-facebook-pixel')
    .then(module => module.default)
    .then(ReactPixel => {
      ReactPixel.init('497457848043067')
      ReactPixel.trackCustom('ViewContent')
    })
  console.log("1. Event ViewContent fired!");
}

class PromotionItem extends Component {
  constructor() {
    super();
    this.state = {
      mobile: false
    }
  }

  componentDidMount() {
    console.log(theme.mobile)
    console.log(theme.mobile)
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
  goTo(url) {
    if (!url) {
      return
    }
    if (url.startsWith('http')) {
      window.location.href = url
    }
    else {
      Router.pushRoute(url)
    }
  }

  render() {
    const { image, title, subTitle, price, priceType, url } = this.props;
    const banner_img_item = image
    const order_now_arrow = require(`$assets/images/order-now-arrow.png`)
    let returnHTML = ''
    if (!this.state.mobile) {
      returnHTML = <div className={'promotion-item '}>
        <div className="main-promotion-item">
          <div className="title-area-item">
            <div className="banner_title_item">
              {title}
              <span>{price}<b className="priceType">{priceType}</b><br /><strong>כולל מע"מ</strong></span>
            </div>
            <div className="subtitle text">
              {subTitle}
            </div>
            <div className="button button-primary truncate" onClick={() => {
              handleBuy()
              this.goTo(url)
            }
            }>
              {'הזמינו עכשיו '}<img id="arrowOrder" src={order_now_arrow} alt="Order now arrow" />
            </div>
          </div>
          <div className="left_banner_img_item">
            {banner_img_item && <img src={banner_img_item} alt="Left Banner Image" />}
          </div>
        </div>
      </div>
    } else {
      returnHTML = <div className={'promotion-item-mobile '}>
        <div className="mobile_banner">
          <div className="mobile_banner_img_item">
            {banner_img_item && <img className="mobile_img_item" src={banner_img_item} alt="Banner Image" />}
          </div>
        </div>

        <div className="title-area-item-mobile">
          <div className="banner_title_item_mobile">
            {title}
            <span className="priceBubble">{price}<b className="priceType">{priceType}</b><br /><strong>כולל מע"מ</strong></span>
          </div>
          <div className="subtitle-mobile">
            {subTitle}
          </div>
        </div>

        <div className="button-mobile" onClick={() => {
          handleBuy()
          this.goTo(url)
        }
        }>
          {'הזמינו עכשיו '}<img id="arrowOrder" src={order_now_arrow} alt="Order now arrow" />
        </div>
      </div>
    }
    return returnHTML
  }
}

export default PromotionItem

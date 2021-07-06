import React from "react"
import { Router } from '$routes'
import { mobileSize } from './consts'
import './PromotionItem.scss'

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

const goTo = (url) => {
  if (!url) return
  if (url.startsWith('http')) window.location.href = url
  else Router.pushRoute(url)
}

const PromotionItem = (props) => {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= mobileSize && mobile == true) setMobile(false)
      if (window.innerWidth < mobileSize && mobile == false) setMobile(true)
    }
    console.log('initialization!')
    import('react-facebook-pixel')
      .then(module => module.default)
      .then(ReactPixel => {
        ReactPixel.init('497457848043067')
        ReactPixel.pageView()
      })
    window.addEventListener('resize', handleResize)
    const mobileStatus = window.innerWidth < mobileSize
    if (mobileStatus != mobile) setMobile(mobileStatus)
  })


  let { image, title, subTitle, price, priceType, url } = props;

  const banner_img_item = image
  const order_now_arrow = require(`$assets/images/order-now-arrow.png`)

  let returnHTML = ''
  if (!mobile) {
    returnHTML = <div className={'promotion-item '}>
      <div className="main-promotion-item">
        <div className="title-area-item">
          <div className="banner_title_item">
            <div className="banner_title_text">{title}</div>
            <span>{price}<b className="priceType">{priceType}</b><br /><strong>כולל מע"מ</strong></span>
          </div>
          <div className="subtitle text">
            {subTitle}
          </div>
          <div className="button button-primary" onClick={() => {
            handleBuy()
            goTo(url)
          }
          }>
            {'הזמינו עכשיו '}<img id="arrowOrder" src={order_now_arrow} alt="Order now arrow" />
          </div>
        </div>
        <div className="left_banner_img_item">
          {banner_img_item && <img src={banner_img_item} className={banner_img_item.includes('A4') ? 'A4-banner' : ''} alt="Left Banner Image" />}
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
        goTo(url)
      }
      }>
        {'הזמינו עכשיו '}<img id="arrowOrder" src={order_now_arrow} alt="Order now arrow" />
      </div>
    </div>
  }
  return returnHTML
}

export default PromotionItem

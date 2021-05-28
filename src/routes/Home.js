/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionItem from '../components/PromotionItem'
import PromotionMain from '../components/PromotionMain'
import { Router } from '$routes'
import Gallery from '$core-components/Gallery'
import CategoryItem from '../components/CategoryItem'
import ProductItem from '../components/ProductItem'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Home.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { getIsNGProduct } from '../services/utils'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import $ from 'jquery';

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemButtonUrl: ''
    }

  }

  componentDidMount() {
    // if ($(window).width() < 561) {
    //   $('.subtitle').html("חתכנו את השומן, הגדרנו מראש את המכונה ויצרנו אוטומציה אחת מלאה. התחשבנו רק במה שחשוב - במחיר ובאיכות. נסו אותנו.");
    // }
    window.addEventListener('resize', this.onResize.bind(this));
    throttle(250, this.onResize);					// Call this function once in 250ms only

    this.onResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)

    this.clearCustomState()
  }

  clearCustomState() {
    UStoreProvider.state.customState.delete('homeFeaturedProducts')
    UStoreProvider.state.customState.delete('homeFeaturedCategory')
    UStoreProvider.state.customState.delete('currentProduct')
    UStoreProvider.state.customState.delete('currentOrderItem')
    UStoreProvider.state.customState.delete('currentOrderItemId')
    UStoreProvider.state.customState.delete('currentOrderItemPriceModel')
    UStoreProvider.state.customState.delete('lastOrder')
    UStoreProvider.state.customState.delete('currentProductThumbnails')
  }

  onResize() {
    this.setState({ isMobile: document.body.clientWidth < parseInt(theme.md.replace('px', '')) })
  }

  static getDerivedStateFromProps(props, state) {
    if (!(props.state && props.customState)) {
      return null
    }

    const { categories } = props.customState
    //NOTE: this is not supported in SSR
    if (categories && categories.length && !state.promotionItemButtonUrl.length) {
      const { FriendlyID, Name } = categories[0]
      const defaultURL = urlGenerator.get({ page: 'category', id: FriendlyID, name: decodeStringForURL(Name) })
      return { promotionItemButtonUrl: getVariableValue('--homepage-carousel-slide-1-button-url', defaultURL, false, true) }
    }
    return null
  }



  render() {
    if (!this.props.state) {
      return null
    }

    const { customState: { categories, homeFeaturedProducts, homeFeaturedCategory }, state: { currentStore } } = this.props

    const amount_icon = require(`$assets/images/amount.png`)
    const upload_icon = require(`$assets/images/upload.png`)
    const delivery_icon = require(`$assets/images/delivery.png`)
    const step_icon = require(`$assets/images/item_arr.png`)

    const left_banner_img = require(`$assets/images/banner_img.png`)


    const promotionItemImageUrl = getVariableValue('--homepage-carousel-slide-1-image', require(`$assets/images/banner_image.png`), true)
    const promotionItemTitle = getVariableValue('--homepage-carousel-slide-1-main-text', t('PromotionItem.Title'))
    const promotionItemSubtitle = getVariableValue('--homepage-carousel-slide-1-sub-text', t('PromotionItem.Subtitle'))
    const promotionItemButtonText = getVariableValue('--homepage-carousel-slide-1-button-text', t('PromotionItem.Button_Text'))

    return (
      <Layout {...this.props} className="home">
        <div id="header_bottom"></div>
        <div className="promotion-wrapper">
          {/* <div className="wrapper"> */}
          <Slider>
            <PromotionMain />
          </Slider>
          {/* </div> */}
        </div>
        <div className="Gallery">
          <Gallery />
        </div>
      </Layout>
    )
  }
}

Home.getInitialProps = async function (ctx) {
  const maxInPage = 200
  const { Count } = await UStoreProvider.api.categories.getTopCategories(1, maxInPage)
  if (Count === 0) {
    return { homeFeaturedProducts: null, homeFeaturedCategory: null }
  }

  const page = Math.ceil(Count / maxInPage)
  const { Categories } = await UStoreProvider.api.categories.getTopCategories(page, maxInPage)

  if (Categories.length === 0) {
    return { homeFeaturedProducts: null, homeFeaturedCategory: null }
  }

  const homeFeaturedCategory = Categories[Count - 1]
  const { Products: homeFeaturedProducts } = await UStoreProvider.api.products.getProducts(homeFeaturedCategory.ID, 1)
  return { homeFeaturedProducts, homeFeaturedCategory }
}

export default Home

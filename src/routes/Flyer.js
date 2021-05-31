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
import HowTo from '../components/HowTo'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Flyer.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import $ from 'jquery';

class Flyer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemButtonUrl: ''
    }

  }

  componentDidMount() {
    $("#left-payments span").html("* בשעות הפעילות");
    $("#left-payments-mobile").html("* בשעות הפעילות");
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
    const left_banner_img = require(`$assets/images/banner_img.png`)

    return (
      <Layout {...this.props} className="Flyer">
        <div id="header_bottom"></div>
        <div className="flyer-wrapper">
          <div className="wrapper">
            <Slider>
              <PromotionItem
                image={require(`$assets/images/flyer-main.png`)}
                title={"פלייר גודל A5"}
                subTitle={
                  <ul>
                    <li>הדפסה על נייר כרומו מט 130 גרם</li>
                    <li>הדפסה צבעונית דו צדדית (או חד צדדית)</li>
                    <li>ללא מינימום לפריט</li>
                  </ul>
                }
                price="10"
                priceType="אג'"
                url={this.state.promotionItemButtonUrl}
              />
            </Slider>
          </div>
        </div>
        <HowTo
          keyWord={'פליירים'}
        />
      </Layout>
    )
  }
}


export default Flyer

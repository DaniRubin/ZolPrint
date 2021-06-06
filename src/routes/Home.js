/**
 * This is the Homepage
 * URL : http://<store-domain>/{language-code}/home/
 *
 * @param {object} state - the state of the store
 */
import { UStoreProvider } from '@ustore/core'
import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionMain from '../components/PromotionMain'
import Gallery from '$core-components/Gallery'
import ProductItem from '../components/ProductItem'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import './Home.scss'
import { Component } from 'react'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { decodeStringForURL } from '$ustoreinternal/services/utils'

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemButtonUrl: ''
    }

  }

  componentDidMount() {
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

  getNextPage(name) {
    switch (name) {
      case "פוסטר 50X70":
        return 'Poster'
      case "פלייר A5":
        return 'Flyer'
      default:
        return 'home'
    }
  }

  render() {
    if (!this.props.state) {
      return null
    }
    const { customState: { categories, homeFeaturedProducts, homeFeaturedCategory }, state: { currentStore } } = this.props

    return (
      <Layout {...this.props} className="home">
        <div id="header_bottom"></div>
        <div className="promotion-wrapper">
          <Slider>
            <PromotionMain />
          </Slider>
        </div>


        {homeFeaturedCategory && homeFeaturedProducts &&
          <div className="featured-products-wrapper">
            <center>
              <Gallery title='המוצרים שלנו'
                gridRows="2">
                {
                  homeFeaturedProducts.map((model) => {
                    const hideProduct =
                      this.state.isMobile &&
                      model.Attributes &&
                      model.Attributes.find(attr => attr.Name === 'UEditEnabled' && attr.Value === 'true') !== undefined

                    return !hideProduct &&
                      <ProductItem
                        key={model.ID}
                        model={model}
                        url={urlGenerator.get({ page: this.getNextPage(model.Name) })}
                      />
                  })
                }
              </Gallery>
            </center>
          </div>
        }
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

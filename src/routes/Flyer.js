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
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import './Flyer.scss'
import { Component } from 'react'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import theme from '$styles/_theme.scss'
import { throttle } from 'throttle-debounce'
import { decodeStringForURL } from '$ustoreinternal/services/utils'

class Flyer extends Component {

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
            <Layout {...this.props} className="Flyer">
                <div id="header_bottom"></div>
                <div className="promotion-wrapper">
                    <div className="wrapper">
                        <Slider>
                            <PromotionItem
                                imageUrl={promotionItemImageUrl}
                                title={promotionItemTitle}
                                subTitle={promotionItemSubtitle}
                                buttonText={promotionItemButtonText}
                                url={this.state.promotionItemButtonUrl}
                            />
                        </Slider>
                    </div>
                </div>
                <div className="how-works">
                    <div className="wrapper">
                        <div className="how-works-title">
                            פלייר
             </div>
                        <div className="how-works-items">
                            <div className="how-works-item">
                                <div className="how-works-item-img">
                                    {upload_icon && <img src={upload_icon} alt="Upload" />}
                                </div>
                                <span>מעלים קובץ</span>
                                <p>
                                    מעלים PDF/JPG בגודל 50X70
                 </p>
                            </div>
                        </div>
                        <div className="next-step-img">
                            {step_icon && <img src={step_icon} className="next-step" alt="Next step" />}
                        </div>
                        <div className="how-works-items">
                            <div className="how-works-item">
                                <div className="how-works-item-img">
                                    {amount_icon && <img src={amount_icon} alt="Amount" />}
                                </div>
                                <span>בוחרים כמות</span>
                                <p>
                                    בוחרים כמה פוסטרים רוצים
                 </p>
                            </div>
                        </div>
                        <div className="next-step-img">
                            {step_icon && <img src={step_icon} className="next-step" alt="Next step" />}
                        </div>
                        <div className="how-works-items">
                            <div className="how-works-item">
                                <div className="how-works-item-img">
                                    {delivery_icon && <img src={delivery_icon} style={{ marginTop: "37px" }} alt="Delivery" />}
                                </div>
                                <span>בדרך אליכם</span>
                                <p>
                                    איסוף מהמפעל תוך 24 שעות בלבד*<br></br>
                   אפשרות למשלוח לכל רחבי הארץ
                 </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}


export default Flyer

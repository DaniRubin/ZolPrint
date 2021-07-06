import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionItem from '../components/PromotionItem'
import HowTo from '../components/HowTo'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import Bubble from '../components/Layout/Bubble'
import './Flyer.scss'
import { Component } from 'react'

class FlyerA5 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
    }
  }

  render() {
    if (!this.props.state) {
      return null
    }

    return (
      <Layout {...this.props} className="FlyerA4">
        <Bubble
          price='20'
          priceType="אג'"
          product={" לפלייר"}
        />
        <div id="header_bottom_flyer"></div>
        <div className="flyer-wrapper">
          <div className="wrapper">
            <Slider>
              <PromotionItem
                image={require(`$assets/images/flyer-A4.png`)}
                title={"פלייר גודל A4"}
                subTitle={
                  <ul>
                    <li>הדפסה על נייר כרומו מט 130 גרם</li>
                    <li>הדפסה צבעונית דו צדדית (או חד צדדית)</li>
                    <li>מינימום הזמנה ₪10 בלבד</li>
                  </ul>
                }
                price="20"
                priceType="אג'"
                url={urlGenerator.get({ page: 'product', id: 1271 })}
              />
            </Slider>
          </div>
        </div>
        <HowTo
          amountWord={'פליירים'}
          uploadWord={'מעלים תמונה או PDF בגודל A4'}
        />
      </Layout>
    )
  }
}

export default FlyerA5

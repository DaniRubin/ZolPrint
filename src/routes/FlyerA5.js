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
      <Layout {...this.props} className="FlyerA5">
        <Bubble
          price='10'
          priceType="אג'"
          product={" לפלייר"}
        />
        <div id="header_bottom_flyer"></div>
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
                url={urlGenerator.get({ page: 'product', id: 1229 })}
              />
            </Slider>
          </div>
        </div>
        <HowTo
          amountWord={'פליירים'}
          uploadWord={'מעלים תמונה או PDF בגודל A5'}
        />
      </Layout>
    )
  }
}

export default FlyerA5

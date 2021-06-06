import Layout from '../components/Layout'
import Slider from '$core-components/Slider'
import PromotionItem from '../components/PromotionItem'
import Bubble from '../components/Layout/Bubble'
import HowTo from '../components/HowTo'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import './Poster.scss'
import { Component } from 'react'
import $ from 'jquery';

class Poster extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobile: false,
      promotionItemButtonUrl: urlGenerator.get({ page: 'product', id: 1218 })
    }

  }

  componentDidMount() {
    // $("#left-payments span").html("* בשעות הפעילות");
    // $("#left-payments-mobile").html("* בשעות הפעילות");
  }

  render() {
    if (!this.props.state) {
      return null
    }

    return (
      <Layout {...this.props} className="Poster">
        <Bubble
          price='₪1'
          priceType=""
          product="לפוסטר"
        />

        <div id="header_bottom_poster"></div>
        <div className="poster-wrapper">
          <div className="wrapper">
            <Slider>
              <PromotionItem
                image={require(`$assets/images/poster-main.png`)}
                title={"פוסטר 50X70"}
                subTitle={
                  <ul>
                    <li>הדפסה על נייר כרומו מט 130 גרם</li>
                    <li>הדפסה צבעונית חד צדדית</li>
                    <li>ללא מינימום לפריט</li>
                  </ul>
                }
                price="₪1"
                priceType=""
                url={this.state.promotionItemButtonUrl}
              />
            </Slider>
          </div>
        </div>
        <HowTo
          amountWord={'פוסטרים'}
          uploadWord={'בגודל 50X70'}
        />
      </Layout>
    )
  }
}

export default Poster

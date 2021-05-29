/**
 * A component to display a product's photo, title and more info
 *
 * @param {object} model - ProductModel containing data of the product
 * @param {number} productNameLines - max lines of product name (default is 2)
 * @param {number} descriptionLines - max lines of short description (default is 4)
 * @param {boolean} detailed - controls the display - if true the description of the product should show, otherwise hide
 * @param {string} url - the url to redirect to when clicking the product
 * @param {string} [className] - a class name to place on the product element
 */

import React, { Component } from 'react'
import './ProductItem.scss'
import { Router } from '$routes'
import Price from './Price'
import UnitsOfMeasure from "./UnitsOfMeasure"
import Inventory from "./Inventory"
import HTMLLinesEllipsis from 'react-lines-ellipsis/lib/html'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import ImageLoader from '$core-components/ImageLoader'
import ProductItemQuantity from './ProductItemQuantity'
import Icon from '$core-components/Icon'
import { t } from '$themelocalization'
import Button from '$core-components/Button'
import LoadingDots from '$core-components/LoadingDots'
import { UStoreProvider } from '@ustore/core'

// using this ResponsiveEllipsis will handle responsive changes to the lineEllipsis component.
const ResponsiveHTMLEllipsis = responsiveHOC()(HTMLLinesEllipsis)

const onClick = (url) => {

  if (typeof url === "string") {
    Router.pushRoute(url)
  }
}

class ProductItem extends Component {

  constructor() {
    super()

    this.addToCartShowSuccessTimer = null;

    this.state = {
      currentOrderItem: null,
      isPriceCalculating: false,
      calculatedPriceModel: null,
      addToCartShowSuccess: false,
      quantity: null,
      isQuantityValid: true
    }
  }

  componentWillUnmount() {
    clearTimeout(this.addToCartShowSuccessTimer)
  }

  onQuantityChange = async (value, isValid) => {
    const { model } = this.props

    if (isValid) {
      if (model.HasPricing) {
        this.setState({ isPriceCalculating: true })
        await this.onCalculatePrice(value)
        this.setState({ isPriceCalculating: false, quantity: value, isQuantityValid: true })
      }
      else {
        this.setState({ quantity: value, isQuantityValid: true })
      }
    }
    else {
      this.setState({ quantity: value, isQuantityValid: false })
    }
  }

  onCalculatePrice = async (value) => {
    const { model } = this.props
    const currentOrderItem = this.state.currentOrderItem ? this.state.currentOrderItem : await UStoreProvider.api.orders.addOrderItem(model.ID)

    if (currentOrderItem.Quantity)
      currentOrderItem.Quantity = value

    const priceModel = await UStoreProvider.api.orders.getPriceOrderItem(currentOrderItem.ID, currentOrderItem)

    this.setState({ calculatedPriceModel: priceModel.Price, currentOrderItem: currentOrderItem })

  }

  addToCart = async () => {
    if (!!this.state.isQuantityValid) {
      const { model } = this.props
      const currentOrderItem = this.state.currentOrderItem ? this.state.currentOrderItem : await UStoreProvider.api.orders.addOrderItem(model.ID)

      // call the update order api if quantity is updated
      if (this.state.quantity)
        await UStoreProvider.api.orders.updateOrderItem(currentOrderItem.ID, currentOrderItem)

      await UStoreProvider.api.orders.addToCart(currentOrderItem.ID)
      return true
    }

    return false
  }

  onAddToCartClick = async () => {
    const success = await this.addToCart()

    if (success) {
      this.setState({ addToCartShowSuccess: true, currentOrderItem: null, quantity: null })

      this.addToCartShowSuccessTimer = setTimeout(() => {
        this.setState({ addToCartShowSuccess: false, calculatedPriceModel: null })
      }, 3000)
    }
  }
  getPriceOfProduct = (name) => {
    switch (name) {
      case "פוסטר 50X70":
        return ['1', '₪']
      case "פלייר A5":
        return ["10", "אג'"]
      default:
        return ["0", '₪']
    }
  }

  render() {
    let { descriptionLines, productNameLines, model, url, detailed, className } = this.props

    if (!model) {
      return null
    }

    productNameLines = productNameLines ? productNameLines : 2
    descriptionLines = descriptionLines ? descriptionLines : 4

    const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)
    const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name
    const showQuickAddToCart = model.Configuration && model.Configuration.AllowQuickAddToCart
    const priceAmount = this.getPriceOfProduct(model.Name)

    return (
      <div className={`product-item ${className ? className : ''}`} data-qaautomationinfo={model.FriendlyID}>
        <div className="image-wrapper" onClick={() => onClick(url)}>
          <ImageLoader className="image" src={imageUrl} />
          <div className="price-circle">
            <span className="totalPrice">{priceAmount[0]}</span>&nbsp;
            <span className="priceType">{priceAmount[1]}</span>
            <br />
            <span className="maam">כולל מע"מ</span>
          </div>
        </div>

        <div className="product-name" style={{ maxHeight: `${productNameLines * 1.5}em` }}
          onClick={() => onClick(url)}>
          {productNameAndCatalog}
        </div>
      </div>
    )
  }
}
export default ProductItem

/**
 * A component to display a product's photo, title and more info
 *
 * @param {object} model - ProductModel containing data of the product
 * @param {string} url - the url to redirect to when clicking the product
 */

import React, { Component } from 'react'
import './ProductItem.scss'
import { Router } from '$routes'
import ImageLoader from '$core-components/ImageLoader'

const onClick = (url) => {
  if (typeof url === "string") {
    Router.pushRoute(url)
  }
}

const getPriceOfProduct = (name) => {
  switch (name) {
    case "פוסטר 50X70":
      return ['1', '₪']
    case "פלייר A5":
      return ["10", "אג'"]
    case "פלייר A4":
      return ["20", "אג'"]
    default:
      return ["0", '₪']
  }
}

const ProductItem = (props) => {

  let { model, url, totalPriceSpace, imageToDisplay } = props

  if (!model) {
    return null
  }

  const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)
  const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name
  const priceAmount = getPriceOfProduct(model.Name)
  console.log(totalPriceSpace, model.Name)
  return (
    <div className={`product-item`}>
      <div className="image-wrapper" onClick={() => onClick(url)}>
        <ImageLoader className="image" src={imageToDisplay} />

        <div className="price-circle">
          <div class="price-circle-price">
            <span className={totalPriceSpace ? "totalPrice totalPriceSpace" : "totalPrice"}>{priceAmount[0]}</span>&nbsp;
            <span className="priceType">{priceAmount[1]}</span>
          </div>
          {/* <br /> */}
          <div className="maam">כולל מע"מ</div>
        </div>
      </div>

      <div className="product-name" onClick={() => onClick(url)}>
        {productNameAndCatalog}
      </div>
    </div >
  )
}

export default ProductItem

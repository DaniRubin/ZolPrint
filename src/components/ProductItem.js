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
    default:
      return ["0", '₪']
  }
}

const ProductItem = (props) => {

  let { model, url } =
    props

  if (!model) {
    return null
  }

  const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)
  const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name
  const priceAmount = getPriceOfProduct(model.Name)

  return (
    <div className={`product-item`}>
      <div className="image-wrapper" onClick={() => onClick(url)}>
        <ImageLoader className="image" src={imageUrl} />

        <div className="price-circle">
          <span className="totalPrice">{priceAmount[0]}</span>&nbsp;
            <span className="priceType">{priceAmount[1]}</span>
          <br />
          <span className="maam">כולל מע"מ</span>
        </div>
      </div>

      <div className="product-name" onClick={() => onClick(url)}>
        {productNameAndCatalog}
      </div>
    </div >
  )
}

export default ProductItem

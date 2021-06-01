import './Bubble.scss'

const Bubble = (props) => {
  const { product, price, priceType } = props

  const classes = priceType == '' ? "money-bubble" : "money-bubble shrink"
  return (
    <div id="bubble">
      <span className={classes}>
        {price}
        <span className="money-type-bubble">{priceType}</span>
      </span><br />
      <div className='maam-bubble'>כולל מע"מ</div><br />
      <div className='product-type-bubble'>{product}</div>
    </div>
  )
}

export default Bubble

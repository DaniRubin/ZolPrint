import { productTypes } from '../services/utils'
import './HowTo.scss'

const howTo = (props) => {
  const upload_icon = require(`$assets/images/upload.png`)
  const amount_icon = require(`$assets/images/amount.png`)
  const delivery_icon = require(`$assets/images/delivery.png`)

  return (
    <div className="how-works">
      <div className="wrapper">
        <div className="how-works-title">
          אז איך זה עובד?
             </div>
        <center>
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
            <div className="how-works-item">
              <div className="how-works-item-img">
                {amount_icon && <img src={amount_icon} alt="Amount" />}
              </div>
              <span>בוחרים כמות</span>
              <p>
                בוחרים כמה {props.keyWord} רוצים
                 </p>
            </div>
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

        </center>
      </div>
    </div>
  )
}

export default howTo

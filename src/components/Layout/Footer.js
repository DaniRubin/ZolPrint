import './Footer.scss'
import { Link } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'

/**
 * This component represents the footer in the store
 */
const payments = require(`$assets/images/payments.png`)
const waze = require(`$assets/images/waze.png`)

const Footer = () => {
  return (
    <div className="footer">
      <span id="left-payments-mobile">* בשעות הפעילות</span>
      {/* <div id="bubble">
        <span>₪1</span><br />
        <strong>כולל מע"מ</strong><br />
          לפוסטר
        </div> */}
      <div className="wrapper">
        <div className="nav-right">
          <span>מידע כללי</span>
          <nav>
            <ul>
              <li>
                <Link to={urlGenerator.get({ page: 'Policy' })}>
                  <a>תנאי שימוש</a>
                </Link>

              </li>
              <li>
                <Link to={urlGenerator.get({ page: 'Privacy' })}>
                  <a>מדיניות הפרטיות</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="nav-right">
          <span>מוזמנים לבקר</span>
          <p>
            הסיבים 43, פתח תקווה <a href="https://www.waze.com/he/livemap/directions?latlng=32.0859061%2C34.8573809&navigate=yes">{waze && <img src={waze} alt="waze" />}</a><br></br>
              שעות הפעילות:<br></br>
              א' - ה' 18:00 - 09:00,<br></br>
              ו' וערבי חג 14:00 - 09:00
            </p>
        </div>
        <div id="left-payments">
          <span>* בשעות הפעילות</span><br></br>
          {payments && <img src={payments} alt="payments" />}
        </div>
      </div>
    </div>
  )
}

export default Footer

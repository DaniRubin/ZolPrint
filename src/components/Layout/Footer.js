import './Footer.scss'
import { Link } from '$routes'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import React from 'react'

const payments = require(`$assets/images/payments.png`)
const waze = require(`$assets/images/waze.png`)

const getCurrentURL = (pageURL) => {
  if (pageURL.includes('home')) return 'home'
  if (pageURL.includes('Poster')) return 'Poster'
  if (pageURL.includes('Flyer')) return 'Flyer'
  if (pageURL.endsWith('he-IL/')) return 'home'
}
const Footer = () => {
  const [page_location, setPageLocation] = React.useState('');

  React.useEffect(() => {
    const ans = getCurrentURL(window.location.href);
    setPageLocation(ans);
  })

  return (
    <div className="footer">
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
        {page_location != 'home' && <div className="mobile-work-hours">* בשעות הפעילות</div>}
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
          <span>* בשעות הפעילות</span><br />
          {payments && <img src={payments} alt="payments" />}
        </div>
        <center>
          <div id="payments-mobile">
            {payments && <img height='25px' src={payments} alt="payments" />}
          </div>
        </center>
      </div>
    </div >
  )
}

export default Footer

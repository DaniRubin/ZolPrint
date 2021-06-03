import React from "react"
import './CategoriesSidebar.scss'

const getCurrentURL = (pageURL) => {
  if (pageURL.includes('home')) return 'home'
  if (pageURL.includes('Poster')) return 'Poster'
  if (pageURL.includes('Flyer')) return 'Flyer'
  if (pageURL.includes('Contact')) return 'Contact'
  if (pageURL.endsWith('he-IL/')) return 'home'
}

const CategoriesSidebar = (props) => {
  const [page_location, setPageLocation] = React.useState('');

  React.useEffect(() => {
    const ans = getCurrentURL(window.location.href);
    setPageLocation(ans);
  })

  const cancel = require(`$assets/images/back-drawer.png`)
  const { onRedirect, onClose } = props
  if (!onRedirect) {
    return null
  }

  return (
    <div className={`categories-sidebar`}>
      <div className="back-block">
        <div className="back-icon-container" onClick={onClose}>
          {cancel && <img src={cancel} alt="cancel drawer" />}
        </div>
      </div>
      <div className='categories-list'>
        <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'home' })}>
          <span key="featured-products" className={page_location == 'home' ? "category-name active-category" : 'category-name'}>דף הבית</span>
        </div>
        <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Poster' })}>
          <span key="featured-products" className={page_location == 'Poster' ? "category-name active-category" : 'category-name'}>פוסטר</span>
        </div>
        <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Flyer' })}>
          <span key="featured-products" className={page_location == 'Flyer' ? "category-name active-category" : 'category-name'}>פלייר</span>
        </div>
        <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Contact' })}>
          <span key="featured-products" className={page_location == 'Contact' ? "category-name active-category" : 'category-name'}>צור קשר</span>
        </div>
      </div>
    </div>
  )
}


export default CategoriesSidebar

/**
 * A menu with drill in showing all categories in the system in tablet/mobile view according to the given categories tree
 *
 * @param {object} categoriesTree - a list of CategoryTreeNodeModel, each element denotes a tree node in the categories tree structure.
 * @param {func} onRedirect - the function to be called when the user clicks on a category that doesn't drill in the menu
 */

import { Component } from "react"
import './CategoriesSidebar.scss'
import Icon from '$core-components/Icon'

class CategoriesSidebar extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const { onRedirect, onClose } = this.props

    if (!onRedirect) {
      return null
    }
    const cancel = require(`$assets/images/back-drawer.png`)
    return (
      <div className={`categories-sidebar`}>
        <div className="back-block">
          <div className="back-icon-container" onClick={onClose}>
            {cancel && <img src={cancel} alt="cancel drawer" />}
          </div>
        </div>
        <div className='categories-list'>
          <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'home' })}>
            <span key="featured-products" className="category-name truncate">דף הבית</span>
          </div>
          <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Poster' })}>
            <span key="featured-products" className="category-name truncate">פוסטר</span>
          </div>
          <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Flyer' })}>
            <span key="featured-products" className="category-name truncate">פלייר</span>
          </div>
          <div key="featured-products" className='category-title' onClick={() => onRedirect({ page: 'Contact' })}>
            <span key="featured-products" className="category-name truncate">צור קשר</span>
          </div>
        </div>
      </div>
    )
  }

}

export default CategoriesSidebar

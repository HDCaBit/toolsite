import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faHeart } from '@fortawesome/free-solid-svg-icons'
import { tools, categories } from '../../data/tools'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-sm">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <span>Tools<span className="footer-dot">.101142.xyz</span></span>
            </Link>
            <p>Free online tools for everyone. No signup, no popups, no tracking. Just fast, useful tools.</p>
            <div className="footer-badge">25+ Free Tools</div>
          </div>

          {categories.map(cat => (
            <div className="footer-col" key={cat.id}>
              <h4>{cat.label}</h4>
              <ul>
                {tools.filter(t => t.category === cat.id).map(tool => (
                  <li key={tool.id}>
                    <Link to={tool.path}>{tool.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Tools.101142.xyz — All tools run in your browser. No data is stored or sent to any server.</p>
          <p className="footer-made">Made with <FontAwesomeIcon icon={faHeart} className="heart-icon" /> · Fast · Free · Private</p>
        </div>
      </div>
    </footer>
  )
}

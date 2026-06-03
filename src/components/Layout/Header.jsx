import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container">
        <Link to="/" className="logo" aria-label="Tools.101142.xyz Home">
          <div className="logo-icon">
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <div className="logo-text">
            <span className="logo-main">Tools</span>
            <span className="logo-sub">.101142.xyz</span>
          </div>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/?cat=finance" className="">Finance</Link>
          <Link to="/?cat=developer" className="">Developer</Link>
          <Link to="/?cat=text" className="">Text</Link>
          <Link to="/?cat=converter" className="">Converters</Link>
          <Link to="/?cat=playground" className="" style={{ color: '#a855f7' }}>🎮 Playground</Link>
          <a href="https://whisp.101142.xyz/" target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899', fontWeight: 600 }}>✨ WhispSocial</a>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/">🏠 Home</Link>
          <Link to="/?cat=finance">🧮 Finance & Calculator</Link>
          <Link to="/?cat=developer">🔧 Developer Tools</Link>
          <Link to="/?cat=text">✏️ Text Tools</Link>
          <Link to="/?cat=converter">🔄 Converters</Link>
          <Link to="/?cat=generator">🎲 Generators</Link>
          <Link to="/?cat=playground">🎮 Playground</Link>
          <a href="https://whisp.101142.xyz/" target="_blank" rel="noopener noreferrer">✨ WhispSocial</a>
        </nav>
      )}
    </header>
  )
}

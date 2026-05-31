import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEO/SEOHead'

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="404 — Page Not Found | Tools.101142.xyz"
        description="The page you're looking for doesn't exist."
        path="/404"
      />
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}>404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.7 }}>
          The tool or page you're looking for doesn't exist. Head back to browse all our free tools.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <FontAwesomeIcon icon={faHouse} />
            Back to Home
          </Link>
          <Link to="/" className="btn btn-secondary">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Browse All Tools
          </Link>
        </div>
      </div>
    </>
  )
}

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AdSidebar } from './Layout/AdBanner'
import { tools } from '../data/tools'
import { getIcon } from './ToolCard'
import { useState, useCallback } from 'react'
import '../styles/tool.css'

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }, [])
  return [copied, copy]
}

export function CopyButton({ text, className = '' }) {
  const [copied, copy] = useCopyToClipboard()
  return (
    <button
      className={`btn btn-secondary btn-sm btn-icon ${className}`}
      onClick={() => copy(text)}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function ToolLayout({ tool, children }) {
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4)

  const icon = getIcon(tool.icon)

  return (
    <div className="tool-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.65rem' }} />
          <span>{tool.name}</span>
        </nav>

        {/* Tool Header */}
        <div className="tool-header">
          <div
            className="tool-header-icon"
            style={{
              background: `color-mix(in srgb, ${tool.color} 15%, transparent)`,
              color: tool.color,
            }}
          >
            <FontAwesomeIcon icon={icon} />
          </div>
          <div className="tool-header-content">
            <h1>{tool.name}</h1>
            <p>{tool.description}</p>
          </div>
        </div>

        {/* Layout */}
        <div className="tool-layout">
          <div className="tool-main">
            {children}
          </div>

          <aside className="tool-sidebar">
            <AdSidebar />
            <AdSidebar />
            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="tool-info-box">
                <h4>Related Tools</h4>
                <div className="related-grid">
                  {relatedTools.map(t => (
                    <Link key={t.id} to={t.path} className="related-card">
                      <FontAwesomeIcon icon={getIcon(t.icon)} style={{ color: t.color, fontSize: '0.85rem', flexShrink: 0 }} />
                      <span>{t.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

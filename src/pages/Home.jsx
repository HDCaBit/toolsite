import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBolt, faXmark, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEO/SEOHead'
import ToolCard from '../components/ToolCard'
import { tools, categories } from '../data/tools'
import '../styles/home.css'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const activeCategory = searchParams.get('cat') || 'all'

  const filtered = useMemo(() => {
    return tools.filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory
      const matchSearch = !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'all' || search) return null
    return categories.map(cat => ({
      ...cat,
      tools: tools.filter(t => t.category === cat.id)
    }))
  }, [activeCategory, search])

  const setCategory = (cat) => {
    if (cat === 'all') {
      searchParams.delete('cat')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ cat })
    }
  }

  return (
    <>
      <SEOHead
        title="Tools.101142.xyz — Free Online Tools Collection"
        description="Free collection of 25+ online tools: percentage calculator, JSON formatter, unit converter, QR code generator, password generator, and more. No signup required."
        keywords="online tools, free calculator, json formatter, unit converter, password generator, qr code generator"
        path="/"
      />

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <FontAwesomeIcon icon={faBolt} />
          25+ Free Tools — No Signup Required
        </div>
        <h1>Your All-in-One<br />Online Toolbox</h1>
        <p>Fast, free, and privacy-friendly tools for everyday tasks. Everything runs in your browser — no data leaves your device.</p>

        {/* Search */}
        <div className="container">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="search"
              className="search-input"
              placeholder="Search tools... (e.g. JSON, calculator, QR code)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tools"
              id="tool-search"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">25+</span>
            <span className="stat-label">Tools</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Free</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Popups</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter" role="tablist" aria-label="Filter by category">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
            role="tab"
            aria-selected={activeCategory === 'all'}
          >
            All Tools
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results / Grouped Grid */}
        {search || activeCategory !== 'all' ? (
          <div className="tools-section">
            {filtered.length === 0 ? (
              <div className="no-results">
                <FontAwesomeIcon icon={faFaceSmile} />
                <h3>No tools found</h3>
                <p>Try a different search term or browse all categories.</p>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
                  Showing {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
                  {search && ` for "${search}"`}
                </p>
                <div className="tools-grid">
                  {filtered.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          groupedByCategory && groupedByCategory.map(cat => (
            <section key={cat.id} className="tools-section">
              <div className="section-header">
                <h2 style={{ color: cat.color }}>{cat.label}</h2>
              </div>
              <div className="tools-grid">
                {cat.tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  )
}

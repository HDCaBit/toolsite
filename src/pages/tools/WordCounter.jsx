import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'word-counter')

export default function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text.trim()) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0, topWords: [] }
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w.length > 0).length
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0)
    const readingTime = Math.max(1, Math.ceil(words / 200))

    // Top 5 words
    const wordFreq = {}
    text.toLowerCase().match(/\b[a-z']+\b/g)?.forEach(w => {
      const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','it','as','be','by','we','he','she','they','i','you','this','that','are','was','were','have','has','had','not','from','do','so','if','up','out','all','can'])
      if (!stopWords.has(w) && w.length > 2) {
        wordFreq[w] = (wordFreq[w] || 0) + 1
      }
    })
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, topWords }
  }, [text])

  const statCards = [
    { label: 'Words', value: stats.words, color: '#6366f1' },
    { label: 'Characters', value: stats.chars, color: '#10b981' },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces, color: '#f59e0b' },
    { label: 'Sentences', value: stats.sentences, color: '#ec4899' },
    { label: 'Paragraphs', value: stats.paragraphs, color: '#14b8a6' },
    { label: `Reading Time (min)`, value: stats.readingTime, color: '#818cf8' },
  ]

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="wc-input">
                <FontAwesomeIcon icon={faAlignLeft} style={{ marginRight: 8, color: 'var(--accent-light)' }} />
                Paste or type your text
              </label>
              {text && (
                <button className="btn btn-secondary btn-sm" onClick={() => setText('')}>
                  <FontAwesomeIcon icon={faDeleteLeft} /> Clear
                </button>
              )}
            </div>
            <textarea
              id="wc-input"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Start typing or paste your text here…"
              style={{ minHeight: 220, fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}
            />
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}>
            {statCards.map(card => (
              <div key={card.label} style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                borderTop: `3px solid ${card.color}`,
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color, fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
                  {card.value.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Top Words */}
          {stats.topWords.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Top 5 Most Frequent Words
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stats.topWords.map(([word, count]) => {
                  const pct = stats.topWords[0] ? (count / stats.topWords[0][1]) * 100 : 0
                  return (
                    <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-primary)', minWidth: 100 }}>{word}</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-light))', borderRadius: 3, transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 30, textAlign: 'right' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

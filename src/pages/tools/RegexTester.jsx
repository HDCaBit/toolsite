import { useState, useEffect } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'regex-tester')

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false })
  const [testStr, setTestStr] = useState('The quick brown fox jumps over the lazy dog.\nHello World! Hello JavaScript!')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!pattern) { setResult(null); setError(''); return }
    try {
      const f = Object.entries(flags).filter(([,v]) => v).map(([k]) => k).join('')
      const regex = new RegExp(pattern, f)
      setError('')
      const matches = []
      let m
      const gRegex = new RegExp(pattern, f.includes('g') ? f : f + 'g')
      while ((m = gRegex.exec(testStr)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
        if (!f.includes('g')) break
      }

      // Highlighted HTML
      let highlighted = testStr
      if (matches.length > 0 && flags.g) {
        const rh = new RegExp(pattern, f.includes('g') ? f : f + 'g')
        highlighted = testStr.replace(rh, (match) => `<mark style="background:rgba(99,102,241,0.35);color:var(--accent-light);border-radius:3px;padding:0 2px;">${match.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</mark>`)
      } else if (matches.length > 0) {
        const once = new RegExp(pattern, f.replace('g',''))
        highlighted = testStr.replace(once, (match) => `<mark style="background:rgba(99,102,241,0.35);color:var(--accent-light);border-radius:3px;padding:0 2px;">${match.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</mark>`)
      }
      highlighted = highlighted.replace(/\n/g, '<br/>')
      setResult({ matches, highlighted, count: matches.length })
    } catch (e) {
      setError(e.message)
      setResult(null)
    }
  }, [pattern, flags, testStr])

  const flagList = ['g', 'i', 'm', 's']
  const flagLabels = { g: 'Global', i: 'Case-insensitive', m: 'Multiline', s: 'Dot-all' }

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          {/* Regex input */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Regular Expression</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
              <input
                type="text"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="[A-Z]\w+"
                style={{ paddingLeft: 28, paddingRight: 28, fontFamily: 'var(--font-mono)', borderColor: error ? '#ef4444' : undefined }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/{Object.entries(flags).filter(([,v])=>v).map(([k])=>k).join('')}</span>
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 4 }}>⚠ {error}</div>}
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {flagList.map(f => (
              <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={flags[f]} onChange={e => setFlags(prev => ({ ...prev, [f]: e.target.checked }))} />
                <code style={{ background: 'var(--bg-input)', padding: '1px 6px', borderRadius: 4, fontSize: '0.8rem' }}>{f}</code> {flagLabels[f]}
              </label>
            ))}
          </div>

          {/* Test string */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Test String</label>
            <textarea rows={4} value={testStr} onChange={e => setTestStr(e.target.value)} />
          </div>

          {/* Result */}
          {result && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <span className="badge" style={{ background: result.count > 0 ? 'rgba(16,185,129,0.15)' : 'var(--bg-input)', color: result.count > 0 ? '#10b981' : 'var(--text-muted)', borderColor: result.count > 0 ? 'rgba(16,185,129,0.3)' : 'var(--border)' }}>
                  {result.count} match{result.count !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Highlighted result */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem', minHeight: 80 }}
                dangerouslySetInnerHTML={{ __html: result.highlighted || testStr.replace(/\n/g,'<br/>') }}
              />

              {/* Match list */}
              {result.matches.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Matches</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.matches.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-secondary)', borderRadius: 6, padding: '6px 12px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', minWidth: 24 }}>#{i+1}</span>
                        <code style={{ color: 'var(--accent-light)', flex: 1, fontSize: '0.85rem' }}>"{m.match}"</code>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>index {m.index}</span>
                        {m.groups.filter(Boolean).map((g, gi) => (
                          <span key={gi} className="tag">group {gi+1}: {g}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

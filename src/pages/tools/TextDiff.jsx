import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeCompare, faPlus, faMinus, faEquals } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'text-diff')

function computeDiff(textA, textB) {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const result = []
  const m = linesA.length, n = linesB.length
  // Simple LCS-based diff
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = linesA[i-1] === linesB[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
  let i = m, j = n
  const ops = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i-1] === linesB[j-1]) {
      ops.push({ type: 'same', text: linesA[i-1] }); i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.push({ type: 'add', text: linesB[j-1] }); j--
    } else {
      ops.push({ type: 'del', text: linesA[i-1] }); i--
    }
  }
  ops.reverse()
  return ops
}

export default function TextDiff() {
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [diff, setDiff] = useState(null)

  const compare = useCallback(() => {
    setDiff(computeDiff(textA, textB))
  }, [textA, textB])

  const additions = diff ? diff.filter(d => d.type === 'add').length : 0
  const deletions = diff ? diff.filter(d => d.type === 'del').length : 0
  const unchanged = diff ? diff.filter(d => d.type === 'same').length : 0

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
          <div className="textarea-dual" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label style={{ color: '#10b981' }}>
                <FontAwesomeIcon icon={faEquals} style={{ marginRight: 8 }} />
                Original Text (A)
              </label>
              <textarea
                value={textA}
                onChange={e => setTextA(e.target.value)}
                placeholder="Paste original text here…"
                style={{ minHeight: 220 }}
              />
            </div>
            <div className="form-group">
              <label style={{ color: '#6366f1' }}>
                <FontAwesomeIcon icon={faEquals} style={{ marginRight: 8 }} />
                Modified Text (B)
              </label>
              <textarea
                value={textB}
                onChange={e => setTextB(e.target.value)}
                placeholder="Paste modified text here…"
                style={{ minHeight: 220 }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={compare}
            disabled={!textA && !textB}
            style={{ marginBottom: 24, width: '100%' }}
          >
            <FontAwesomeIcon icon={faCodeCompare} />
            Compare Texts
          </button>

          {diff && (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 14px' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ color: '#10b981', fontSize: '0.8rem' }} />
                  <span style={{ color: '#10b981', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{additions} additions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px' }}>
                  <FontAwesomeIcon icon={faMinus} style={{ color: '#ef4444', fontSize: '0.8rem' }} />
                  <span style={{ color: '#ef4444', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{deletions} deletions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{unchanged} unchanged</span>
                </div>
              </div>

              {/* Diff view */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxHeight: 500,
                overflowY: 'auto',
              }}>
                {diff.map((line, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    background: line.type === 'add'
                      ? 'rgba(16,185,129,0.10)'
                      : line.type === 'del'
                      ? 'rgba(239,68,68,0.10)'
                      : 'transparent',
                    borderLeft: `3px solid ${line.type === 'add' ? '#10b981' : line.type === 'del' ? '#ef4444' : 'transparent'}`,
                  }}>
                    <div style={{
                      width: 28,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: line.type === 'add' ? '#10b981' : line.type === 'del' ? '#ef4444' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {line.type === 'add' ? '+' : line.type === 'del' ? '−' : ''}
                    </div>
                    <pre style={{
                      flex: 1,
                      margin: 0,
                      padding: '4px 12px 4px 4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      color: line.type === 'add' ? '#10b981' : line.type === 'del' ? '#ef4444' : 'var(--text-secondary)',
                    }}>
                      {line.text || '\u00a0'}
                    </pre>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faMinus, faCheck, faTriangleExclamation, faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'json-formatter')

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null) // null | 'valid' | 'error'

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); setStatus(null); return }
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      setStatus('valid')
    } catch (e) {
      setOutput('')
      setError(e.message)
      setStatus('error')
    }
  }, [input])

  const minify = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); setStatus(null); return }
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      setStatus('valid')
    } catch (e) {
      setOutput('')
      setError(e.message)
      setStatus('error')
    }
  }, [input])

  const validate = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); setStatus(null); return }
    try {
      JSON.parse(input)
      setOutput('✓ Valid JSON')
      setError('')
      setStatus('valid')
    } catch (e) {
      setOutput('')
      setError(e.message)
      setStatus('error')
    }
  }, [input])

  const clear = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
    setStatus(null)
  }, [])

  const inputCharCount = input.length
  const outputCharCount = output.length

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
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>JSON Input</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g. {"name":"Alice","age":30}'
              rows={10}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {inputCharCount.toLocaleString()} characters
            </div>
          </div>

          <div className="row" style={{ marginBottom: '20px', gap: '8px' }}>
            <button className="btn btn-primary" onClick={format}>
              <FontAwesomeIcon icon={faAlignLeft} />
              Format / Beautify
            </button>
            <button className="btn btn-secondary" onClick={minify}>
              <FontAwesomeIcon icon={faMinus} />
              Minify
            </button>
            <button className="btn btn-secondary" onClick={validate}>
              <FontAwesomeIcon icon={faCheck} />
              Validate
            </button>
            <button className="btn btn-secondary" onClick={clear} style={{ marginLeft: 'auto' }}>
              Clear
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#f87171',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-mono)',
            }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Invalid JSON:</strong> {error}</span>
            </div>
          )}

          {(output || status === 'valid') && (
            <div className="result-panel">
              <div className="result-panel-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faCode} />
                  Output
                  {status === 'valid' && (
                    <span style={{
                      background: 'rgba(16,185,129,0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '100px',
                      fontSize: '0.7rem',
                      padding: '1px 8px',
                      fontWeight: 600,
                    }}>VALID JSON</span>
                  )}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {outputCharCount > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {outputCharCount.toLocaleString()} chars
                    </span>
                  )}
                  {output && <CopyButton text={output} />}
                </div>
              </div>
              <div className="result-panel-body">
                {output}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

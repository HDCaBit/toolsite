import { useState } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShield, faCircleCheck, faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'jwt-decoder')

function parseJwt(token) {
  try {
    const parts = token.trim().split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts')
    const decode = (str) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
      return JSON.parse(atob(padded))
    }
    return {
      header: decode(parts[0]),
      payload: decode(parts[1]),
      signature: parts[2],
      parts,
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

function getExpiryStatus(payload) {
  if (!payload.exp) return { status: 'no-expiry', label: 'No Expiry', color: 'var(--text-muted)' }
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp < now) return { status: 'expired', label: `Expired ${new Date(payload.exp * 1000).toLocaleString()}`, color: '#ef4444' }
  return { status: 'valid', label: `Valid until ${new Date(payload.exp * 1000).toLocaleString()}`, color: 'var(--color-finance)' }
}

export default function JwtDecoder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const decode = () => {
    setError('')
    setResult(null)
    if (!input.trim()) return
    try {
      const parsed = parseJwt(input.trim())
      setResult(parsed)
    } catch (e) {
      setError(e.message)
    }
  }

  const expiry = result ? getExpiryStatus(result.payload) : null

  const colorParts = (token) => {
    const parts = token.split('.')
    const colors = ['#ec4899', '#6366f1', '#10b981']
    return parts.map((p, i) => (
      <span key={i} style={{ color: colors[i] }}>{p}{i < 2 ? <span style={{ color: 'var(--text-muted)' }}>.</span> : ''}</span>
    ))
  }

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>JWT Token</label>
            <textarea
              rows={4}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste your JWT token here... eyJhbGciOiJIUzI1NiJ9..."
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
          </div>
          <button className="btn btn-primary" onClick={decode} disabled={!input.trim()}>
            <FontAwesomeIcon icon={faShield} /> Decode JWT
          </button>

          {error && <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: '0.875rem' }}><FontAwesomeIcon icon={faCircleXmark} /> {error}</div>}

          {result && (
            <>
              <div className="divider" />
              {/* Colored token display */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', wordBreak: 'break-all', marginBottom: '1rem' }}>
                {colorParts(input.trim())}
              </div>

              {/* Expiry */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <FontAwesomeIcon icon={expiry.status === 'expired' ? faCircleXmark : faCircleCheck} style={{ color: expiry.color }} />
                <span style={{ color: expiry.color, fontWeight: 600, fontSize: '0.875rem' }}>{expiry.label}</span>
              </div>

              {/* Header */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Header</div>
                <div className="result-panel">
                  <div className="result-panel-body">{JSON.stringify(result.header, null, 2)}</div>
                </div>
              </div>

              {/* Payload */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payload</div>
                  <CopyButton text={JSON.stringify(result.payload, null, 2)} />
                </div>
                <div className="result-panel">
                  <div className="result-panel-body">{JSON.stringify(result.payload, null, 2)}</div>
                </div>
              </div>

              {/* Signature */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Signature (raw)</div>
                <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10b981', wordBreak: 'break-all' }}>
                  {result.signature}
                </div>
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

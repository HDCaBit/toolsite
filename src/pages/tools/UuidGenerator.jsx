import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faRefresh, faCopy, faCheck, faList } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'uuid-generator')

function generateUUID() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const BULK_OPTIONS = [5, 10, 25]

export default function UuidGenerator() {
  const [uuid, setUuid] = useState('')
  const [bulkCount, setBulkCount] = useState(10)
  const [bulkUuids, setBulkUuids] = useState([])
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = useCallback(() => {
    setUuid(generateUUID())
  }, [])

  const generateBulk = useCallback((count) => {
    setBulkUuids(Array.from({ length: count }, () => generateUUID()))
  }, [])

  const copyAll = useCallback(async () => {
    const text = bulkUuids.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    }
  }, [bulkUuids])

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
          {/* Single UUID */}
          <div style={{ marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Single UUID v4
          </div>

          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            {uuid ? (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.25rem)',
                color: 'var(--accent-light)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                wordBreak: 'break-all',
                marginBottom: '16px',
              }}>
                {uuid.split('-').map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: 'var(--text-muted)' }}>-</span>}
                    {part}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', padding: '8px 0' }}>
                Click "Generate" to create a UUID v4
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={generate}>
                <FontAwesomeIcon icon={faRefresh} />
                Generate
              </button>
              {uuid && <CopyButton text={uuid} />}
            </div>
          </div>

          <div className="divider" />

          {/* Bulk */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              <FontAwesomeIcon icon={faList} style={{ marginRight: '6px' }} />
              Bulk Generate
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {BULK_OPTIONS.map(count => (
                <button
                  key={count}
                  className="btn btn-secondary"
                  onClick={() => { setBulkCount(count); generateBulk(count) }}
                >
                  Generate {count}
                </button>
              ))}
              {bulkUuids.length > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={copyAll}
                  style={{ marginLeft: 'auto' }}
                >
                  <FontAwesomeIcon icon={copiedAll ? faCheck : faCopy} />
                  {copiedAll ? 'Copied All!' : `Copy All (${bulkUuids.length})`}
                </button>
              )}
            </div>
          </div>

          {bulkUuids.length > 0 && (
            <div className="result-panel">
              <div className="result-panel-header">
                <span>{bulkUuids.length} UUID v4s Generated</span>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {bulkUuids.map((u, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      borderBottom: i < bulkUuids.length - 1 ? '1px solid var(--border)' : 'none',
                      gap: '10px',
                    }}
                  >
                    <span style={{
                      width: '28px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      wordBreak: 'break-all',
                    }}>
                      {u}
                    </span>
                    <CopyButton text={u} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

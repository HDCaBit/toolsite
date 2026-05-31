import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen, faArrowRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'base64')

export default function Base64Tool() {
  const [tab, setTab] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return }
    try {
      if (tab === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
        setError('')
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())))
        setOutput(decoded)
        setError('')
      }
    } catch (e) {
      setOutput('')
      setError(tab === 'decode'
        ? 'Invalid Base64 string. Please ensure the input is valid Base64-encoded text.'
        : 'Failed to encode: ' + e.message)
    }
  }, [input, tab])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setInput('')
    setOutput('')
    setError('')
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setOutput('')
    setError('')
  }

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
          <div className="tabs">
            <button
              className={`tab-btn ${tab === 'encode' ? 'active' : ''}`}
              onClick={() => handleTabChange('encode')}
            >
              <FontAwesomeIcon icon={faLock} style={{ marginRight: '6px' }} />
              Encode
            </button>
            <button
              className={`tab-btn ${tab === 'decode' ? 'active' : ''}`}
              onClick={() => handleTabChange('decode')}
            >
              <FontAwesomeIcon icon={faLockOpen} style={{ marginRight: '6px' }} />
              Decode
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>
              {tab === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
            </label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={tab === 'encode'
                ? 'Enter plain text to encode to Base64...'
                : 'Enter Base64 string to decode...'}
              rows={7}
              style={{ fontFamily: tab === 'decode' ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button className="btn btn-primary" onClick={handleConvert}>
              <FontAwesomeIcon icon={faArrowRight} />
              {tab === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
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
            }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {output && (
            <div className="result-panel">
              <div className="result-panel-header">
                <span>{tab === 'encode' ? 'Base64 Output' : 'Decoded Text'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {output.length.toLocaleString()} chars
                  </span>
                  <CopyButton text={output} />
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

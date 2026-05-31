import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faLinkSlash, faArrowRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'url-encoder')

export default function UrlEncoderDecoder() {
  const [tab, setTab] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return }
    try {
      if (tab === 'encode') {
        setOutput(encodeURIComponent(input))
        setError('')
      } else {
        setOutput(decodeURIComponent(input.trim()))
        setError('')
      }
    } catch (e) {
      setOutput('')
      setError(tab === 'decode'
        ? 'Invalid URL-encoded string. Check that percent-encoded sequences are well-formed.'
        : 'Encoding failed: ' + e.message)
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
              <FontAwesomeIcon icon={faLink} style={{ marginRight: '6px' }} />
              Encode
            </button>
            <button
              className={`tab-btn ${tab === 'decode' ? 'active' : ''}`}
              onClick={() => handleTabChange('decode')}
            >
              <FontAwesomeIcon icon={faLinkSlash} style={{ marginRight: '6px' }} />
              Decode
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>
              {tab === 'encode' ? 'Text / URL to Encode' : 'URL-Encoded String to Decode'}
            </label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={tab === 'encode'
                ? 'Enter text or URL to percent-encode, e.g. https://example.com/path?q=hello world'
                : 'Enter URL-encoded string to decode, e.g. https%3A%2F%2Fexample.com%3Fq%3Dhello%20world'}
              rows={7}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button className="btn btn-primary" onClick={handleConvert}>
              <FontAwesomeIcon icon={faArrowRight} />
              {tab === 'encode' ? 'Encode URL' : 'Decode URL'}
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
                <span>{tab === 'encode' ? 'Encoded Output' : 'Decoded Output'}</span>
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

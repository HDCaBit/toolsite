import { useState, useRef, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faDownload, faRefresh } from '@fortawesome/free-solid-svg-icons'
import QRCode from 'qrcode'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'qr-code')

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://tools.101142.xyz')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#000000')
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  const generate = useCallback(async () => {
    if (!text.trim()) { setError('Please enter text or URL'); return }
    setError('')
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      })
    } catch (err) {
      setError('Failed to generate QR code: ' + err.message)
    }
  }, [text, size, fgColor, bgColor])

  useEffect(() => {
    generate()
  }, [generate])

  const download = useCallback(() => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }, [])

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
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>
              <FontAwesomeIcon icon={faQrcode} style={{ marginRight: 8, color: 'var(--accent-light)' }} />
              URL or Text
            </label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="https://example.com or any text..."
            />
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>{error}</div>}
          </div>

          <div className="row" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>Size: <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{size}px</span></label>
              <input
                type="range"
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>128px</span><span>512px</span>
              </div>
            </div>
            <div className="form-group">
              <label>Colors</label>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    style={{ width: 40, height: 36, padding: 2, cursor: 'pointer', borderRadius: 6 }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Foreground</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    style={{ width: 40, height: 36, padding: 2, cursor: 'pointer', borderRadius: 6 }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Background</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{
              padding: 16,
              background: bgColor,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              display: 'inline-block',
              lineHeight: 0,
            }}>
              <canvas ref={canvasRef} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={generate}>
                <FontAwesomeIcon icon={faRefresh} />
                Regenerate
              </button>
              <button className="btn btn-secondary" onClick={download}>
                <FontAwesomeIcon icon={faDownload} />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

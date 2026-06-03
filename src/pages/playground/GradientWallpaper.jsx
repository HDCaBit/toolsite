import { useState, useRef, useEffect, useCallback } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'gradient-wallpaper')

const PRESETS = [
  { name: 'Sunset', colors: ['#ff6b6b', '#feca57'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Aurora', colors: ['#43e97b', '#38f9d7'] },
  { name: 'Neon', colors: ['#f093fb', '#f5576c'] },
  { name: 'Pastel', colors: ['#a18cd1', '#fbc2eb'] },
  { name: 'Midnight', colors: ['#0c3483', '#a2b6df'] },
  { name: 'Cherry Blossom', colors: ['#ffecd2', '#fcb69f'] },
  { name: 'Cyberpunk', colors: ['#00f5ff', '#ff00ff', '#ffff00'] },
]

const SIZE_PRESETS = [
  { name: 'Phone', width: 1080, height: 1920 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'iPad', width: 2048, height: 2732 },
]

export default function GradientWallpaper() {
  const [colors, setColors] = useState(['#ff6b6b', '#feca57'])
  const [gradientType, setGradientType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [activePreset, setActivePreset] = useState('Sunset')
  const [size, setSize] = useState({ name: 'Phone', width: 1080, height: 1920 })
  const [overlayText, setOverlayText] = useState('')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#ffffff')
  const canvasRef = useRef(null)

  const buildGradientCSS = useCallback((cols, type, deg) => {
    const colorStops = cols.map((c, i) => `${c} ${Math.round((i / (cols.length - 1)) * 100)}%`).join(', ')
    if (type === 'radial') {
      return `radial-gradient(circle, ${colorStops})`
    }
    return `linear-gradient(${deg}deg, ${colorStops})`
  }, [])

  const gradientCSS = buildGradientCSS(colors, gradientType, angle)

  const handlePresetClick = (preset) => {
    setColors([...preset.colors])
    setActivePreset(preset.name)
  }

  const handleColorChange = (index, value) => {
    const next = [...colors]
    next[index] = value
    setColors(next)
    setActivePreset(null)
  }

  const addColor = () => {
    if (colors.length < 4) {
      setColors([...colors, '#ffffff'])
      setActivePreset(null)
    }
  }

  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index))
      setActivePreset(null)
    }
  }

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = size

    canvas.width = width
    canvas.height = height

    let gradient
    if (gradientType === 'linear') {
      const rad = (angle * Math.PI) / 180
      const cx = width / 2
      const cy = height / 2
      const len = Math.sqrt(width * width + height * height) / 2
      const x0 = cx - Math.cos(rad) * len
      const y0 = cy - Math.sin(rad) * len
      const x1 = cx + Math.cos(rad) * len
      const y1 = cy + Math.sin(rad) * len
      gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    } else {
      const cx = width / 2
      const cy = height / 2
      const r = Math.max(width, height) / 2
      gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    }

    colors.forEach((c, i) => {
      gradient.addColorStop(i / (colors.length - 1), c)
    })

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    if (overlayText.trim()) {
      ctx.fillStyle = textColor
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const lines = overlayText.split('\n')
      const lineHeight = fontSize * 1.3
      const totalHeight = lines.length * lineHeight
      const startY = (height - totalHeight) / 2 + lineHeight / 2

      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight)
      })
    }

    const link = document.createElement('a')
    link.download = `gradient-wallpaper-${size.width}x${size.height}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [colors, gradientType, angle, size, overlayText, fontSize, textColor])

  const aspectRatio = size.width / size.height

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
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Preset Palettes */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              🎨 Preset Palettes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 'var(--space-sm)'
            }}>
              {PRESETS.map(preset => (
                <div
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    border: activePreset === preset.name
                      ? '2px solid var(--accent)'
                      : '2px solid var(--border)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    background: 'var(--bg-card)',
                  }}
                >
                  <div style={{
                    height: 40,
                    background: buildGradientCSS(preset.colors, 'linear', 135),
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  }} />
                  <div style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: '0.8rem',
                    color: activePreset === preset.name ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: activePreset === preset.name ? 600 : 400,
                    textAlign: 'center',
                  }}>
                    {preset.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Custom Colors */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              🎯 Custom Colors
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              alignItems: 'center'
            }}>
              {colors.map((color, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  background: 'var(--bg-input)',
                  padding: 'var(--space-xs) var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}>
                  <input
                    type="color"
                    value={color}
                    onChange={e => handleColorChange(i, e.target.value)}
                    style={{
                      width: 36,
                      height: 36,
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'transparent',
                    }}
                  />
                  <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    minWidth: 62,
                  }}>
                    {color}
                  </span>
                  {colors.length > 2 && (
                    <button
                      className="btn btn-sm"
                      onClick={() => removeColor(i)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.85rem',
                        lineHeight: 1,
                        color: 'var(--text-muted)',
                      }}
                      title="Remove color"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {colors.length < 4 && (
                <button className="btn btn-secondary btn-sm" onClick={addColor}>
                  + Add Color
                </button>
              )}
            </div>
          </div>

          <div className="divider" />

          {/* Gradient Type & Angle */}
          <div className="row" style={{
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 200px' }}>
              <h3 style={{
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-md)',
                fontSize: '1.1rem',
                fontWeight: 600
              }}>
                🔀 Gradient Type
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <button
                  className={`btn ${gradientType === 'linear' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setGradientType('linear')}
                >
                  Linear
                </button>
                <button
                  className={`btn ${gradientType === 'radial' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setGradientType('radial')}
                >
                  Radial
                </button>
              </div>
            </div>

            {gradientType === 'linear' && (
              <div style={{ flex: '1 1 280px' }}>
                <div className="form-group">
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Angle: <strong style={{ color: 'var(--accent)' }}>{angle}°</strong>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={e => setAngle(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--accent)',
                      marginTop: 'var(--space-xs)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Live Preview */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              👁️ Live Preview
            </h3>
            <div style={{
              width: '100%',
              maxWidth: 600,
              margin: '0 auto',
            }}>
              <div style={{
                width: '100%',
                aspectRatio: `${size.width} / ${size.height}`,
                maxHeight: 500,
                minHeight: 200,
                background: gradientCSS,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {overlayText.trim() && (
                  <span style={{
                    color: textColor,
                    fontSize: `clamp(12px, ${fontSize / 4}px, ${fontSize}px)`,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 'var(--space-md)',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    lineHeight: 1.3,
                  }}>
                    {overlayText}
                  </span>
                )}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: 'var(--space-xs)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}>
                {size.width} × {size.height} — {size.name}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Text Overlay */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              ✏️ Text Overlay
            </h3>
            <div className="row" style={{ gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2 1 240px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Text</label>
                <input
                  type="text"
                  value={overlayText}
                  onChange={e => setOverlayText(e.target.value)}
                  placeholder="Enter text to overlay..."
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    marginTop: 'var(--space-xs)',
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 160px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Font Size: <strong style={{ color: 'var(--accent)' }}>{fontSize}px</strong>
                </label>
                <input
                  type="range"
                  min={16}
                  max={120}
                  value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent)',
                    marginTop: 'var(--space-xs)',
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: '0 0 auto' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Text Color</label>
                <div style={{ marginTop: 'var(--space-xs)' }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    style={{
                      width: 44,
                      height: 44,
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'transparent',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Size Presets */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              📐 Size
            </h3>
            <div style={{
              display: 'flex',
              gap: 'var(--space-xs)',
              flexWrap: 'wrap',
            }}>
              {SIZE_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  className={`btn ${size.name === preset.name ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setSize(preset)}
                >
                  {preset.name}
                  <span style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    marginLeft: 4,
                  }}>
                    {preset.width}×{preset.height}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Download */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 'var(--space-md)',
          }}>
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              style={{
                padding: 'var(--space-sm) var(--space-xl)',
                fontSize: '1.05rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              ⬇️ Download Wallpaper ({size.width}×{size.height})
            </button>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

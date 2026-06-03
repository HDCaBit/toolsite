import { useState, useRef, useEffect, useCallback } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'decision-spinner')

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471',
  '#D7BDE2', '#AED6F1', '#A3E4D7', '#FAD7A0'
]

const PRESETS = [
  {
    label: 'What to Eat?',
    emoji: '🍜',
    options: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Tacos', 'Salad', 'Fried Chicken', 'Steak']
  },
  {
    label: 'What to Watch?',
    emoji: '🎬',
    options: ['K-Drama', 'Anime', 'Marvel', 'Horror', 'Comedy', 'Documentary', 'Action', 'Romance']
  },
  {
    label: 'Where to Go?',
    emoji: '📍',
    options: ['Mall', 'Beach', 'Mountain', 'Cafe', 'Cinema', 'Park', 'Museum', 'Pool']
  }
]

export default function DecisionSpinner() {
  const [inputText, setInputText] = useState('')
  const [options, setOptions] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [history, setHistory] = useState([])
  const [currentRotation, setCurrentRotation] = useState(0)

  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const rotationRef = useRef(0)
  const containerRef = useRef(null)

  const parseOptions = useCallback((text) => {
    return text.split('\n').map(s => s.trim()).filter(Boolean)
  }, [])

  useEffect(() => {
    setOptions(parseOptions(inputText))
  }, [inputText, parseOptions])

  const drawWheel = useCallback((rotation = 0, opts = options) => {
    const canvas = canvasRef.current
    if (!canvas || opts.length < 2) return

    const container = containerRef.current
    if (!container) return
    const size = Math.min(container.offsetWidth - 32, 420)
    canvas.width = size * 2
    canvas.height = size * 2
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'

    const ctx = canvas.getContext('2d')
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = cx - 16

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Shadow under wheel
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2)
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 8
    ctx.fillStyle = 'rgba(0,0,0,0.01)'
    ctx.fill()
    ctx.restore()

    const segAngle = (Math.PI * 2) / opts.length

    opts.forEach((opt, i) => {
      const startAngle = rotation + i * segAngle
      const endAngle = startAngle + segAngle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startAngle + segAngle / 2)

      const maxTextLen = radius * 0.55
      const fontSize = Math.min(Math.max(12, 280 / opts.length), 22)
      ctx.font = `bold ${fontSize}px 'Inter', 'Segoe UI', sans-serif`
      ctx.fillStyle = '#1a1a2e'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      let label = opt
      const measured = ctx.measureText(label).width
      if (measured > maxTextLen) {
        while (ctx.measureText(label + '…').width > maxTextLen && label.length > 1) {
          label = label.slice(0, -1)
        }
        label += '…'
      }

      ctx.fillText(label, radius * 0.55, 0)
      ctx.restore()
    })

    // Center circle
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(1, '#e0e0e0')
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Inner dot
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#667'
    ctx.fill()

    // Pointer at top
    const pointerSize = 24
    ctx.beginPath()
    ctx.moveTo(cx, cy - radius - pointerSize + 4)
    ctx.lineTo(cx - pointerSize * 0.7, cy - radius - pointerSize - 14)
    ctx.lineTo(cx + pointerSize * 0.7, cy - radius - pointerSize - 14)
    ctx.closePath()
    ctx.fillStyle = '#FF6B6B'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.stroke()

    // Outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 6
    ctx.stroke()
  }, [options])

  useEffect(() => {
    drawWheel(rotationRef.current)
  }, [options, drawWheel])

  useEffect(() => {
    const handleResize = () => drawWheel(rotationRef.current)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawWheel])

  const spin = useCallback(() => {
    if (spinning || options.length < 2) return

    setSpinning(true)
    setResult(null)
    setShowResult(false)

    const duration = 3000 + Math.random() * 3000
    const totalRotation = Math.PI * 2 * (5 + Math.random() * 5)
    const startRotation = rotationRef.current
    const startTime = performance.now()

    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      const currentRot = startRotation + totalRotation * easedProgress

      rotationRef.current = currentRot
      drawWheel(currentRot)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Determine winning segment
        const segAngle = (Math.PI * 2) / options.length
        // The pointer is at the top (negative y-axis = -PI/2)
        // We need to find which segment the pointer points to
        const normalizedRotation = ((currentRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        // Pointer is at -PI/2 (top), which means the angle at the pointer is -PI/2
        // The segment at angle θ from the pointer: pointerAngle - rotation
        const pointerAngle = -Math.PI / 2
        const effectiveAngle = ((pointerAngle - normalizedRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        const winnerIndex = Math.floor(effectiveAngle / segAngle) % options.length

        const winner = options[winnerIndex]
        setResult(winner)
        setTimeout(() => setShowResult(true), 100)
        setHistory(prev => {
          const next = [{ text: winner, time: new Date().toLocaleTimeString() }, ...prev]
          return next.slice(0, 10)
        })
        setSpinning(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [spinning, options, drawWheel])

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const applyPreset = (preset) => {
    setInputText(preset.options.join('\n'))
    setResult(null)
    setShowResult(false)
  }

  const clearAll = () => {
    setInputText('')
    setResult(null)
    setShowResult(false)
    setHistory([])
    rotationRef.current = 0
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
        <div className="tool-content" style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Input Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: 'var(--space-lg)',
            alignItems: 'start'
          }}>
            {/* Left: Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Presets */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--space-sm)'
                }}>
                  Quick Presets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      className="btn btn-secondary"
                      onClick={() => applyPreset(preset)}
                      disabled={spinning}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        justifyContent: 'flex-start',
                        fontSize: '0.9rem',
                        width: '100%'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{preset.emoji}</span>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="form-group">
                <label style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--space-xs)',
                  display: 'block'
                }}>
                  Options (one per line)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={'Option 1\nOption 2\nOption 3\n...'}
                  disabled={spinning}
                  rows={8}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: 'var(--space-xs)'
                }}>
                  {options.length} option{options.length !== 1 ? 's' : ''} detected
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                  className="btn btn-primary"
                  onClick={spin}
                  disabled={spinning || options.length < 2}
                  style={{
                    flex: 1,
                    fontSize: '1rem',
                    padding: 'var(--space-sm) var(--space-md)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {spinning ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        animation: 'spinIcon 1s linear infinite'
                      }}>🎡</span>
                      Spinning...
                    </span>
                  ) : (
                    <span>🎯 Spin!</span>
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={clearAll}
                  disabled={spinning}
                  style={{ fontSize: '0.9rem' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Right: Wheel */}
            <div ref={containerRef} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-md)'
            }}>
              {options.length >= 2 ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg) var(--space-md)',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxWidth: '100%',
                      cursor: spinning ? 'not-allowed' : 'pointer'
                    }}
                    onClick={!spinning ? spin : undefined}
                  />
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  width: '100%',
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)'
                }}>
                  <span style={{ fontSize: '3rem', opacity: 0.5 }}>🎡</span>
                  <span style={{ fontSize: '0.95rem' }}>Add at least 2 options to see the wheel</span>
                  <span style={{ fontSize: '0.8rem' }}>or pick a preset to get started!</span>
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--accent)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-md) var(--space-lg)',
                  textAlign: 'center',
                  width: '100%',
                  animation: showResult ? 'resultPulse 0.6s ease-out' : 'none',
                  boxShadow: showResult ? '0 0 30px var(--accent-glow)' : 'none',
                  transition: 'box-shadow 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    🎉 Result
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    wordBreak: 'break-word'
                  }}>
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <>
              <div className="divider" style={{ margin: 'var(--space-lg) 0' }} />
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--space-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  📋 History <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(last 10)</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-xs)'
                }}>
                  {history.map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        background: i === 0 ? 'var(--accent-light)' : 'var(--bg-input)',
                        border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: 'var(--space-xs) var(--space-sm)',
                        fontSize: '0.85rem',
                        color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: i === 0 ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        {entry.time}
                      </span>
                      {entry.text}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Responsive grid for mobile */}
          <style>{`
            @keyframes spinIcon {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes resultPulse {
              0% { transform: scale(0.95); opacity: 0; }
              50% { transform: scale(1.03); }
              100% { transform: scale(1); opacity: 1; }
            }
            @media (max-width: 700px) {
              .tool-content > div:first-child {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </ToolLayout>
    </>
  )
}

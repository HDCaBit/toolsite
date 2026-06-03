import { useState, useRef, useEffect, useCallback } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'meme-generator')

const ASPECT_RATIOS = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: 'Free', value: null },
]

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export default function MemeGenerator() {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageObj, setImageObj] = useState(null)
  const [cropping, setCropping] = useState(false)
  const [croppedImage, setCroppedImage] = useState(null)

  // Crop state
  const [aspectRatio, setAspectRatio] = useState(null) // null = free
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragType, setDragType] = useState(null) // 'move' | 'nw' | 'ne' | 'sw' | 'se'
  const [cropInitRect, setCropInitRect] = useState({ x: 0, y: 0, w: 0, h: 0 })

  // Text overlay state
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [fontSize, setFontSize] = useState(42)
  const [textColor, setTextColor] = useState('#ffffff')
  const [strokeColor, setStrokeColor] = useState('#000000')

  const fileInputRef = useRef(null)
  const cropCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const cropContainerRef = useRef(null)

  // ── Image upload ──────────────────────────────────────────────
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        setImageObj(img)
        setImageSrc(ev.target.result)
        setCroppedImage(null)
        setCropping(true)
        // Default crop = full image
        setCropRect({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight })
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  // ── Compute display scale for crop overlay ────────────────────
  const getDisplayScale = useCallback(() => {
    if (!imageObj || !cropContainerRef.current) return 1
    const containerW = cropContainerRef.current.clientWidth
    const scale = containerW / imageObj.naturalWidth
    return scale
  }, [imageObj])

  // ── Draw crop overlay ─────────────────────────────────────────
  useEffect(() => {
    if (!cropping || !imageObj || !cropCanvasRef.current) return
    const canvas = cropCanvasRef.current
    const scale = getDisplayScale()
    canvas.width = imageObj.naturalWidth * scale
    canvas.height = imageObj.naturalHeight * scale
    const ctx = canvas.getContext('2d')

    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height)

    // Dim outside crop area
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw visible crop region
    const cx = cropRect.x * scale
    const cy = cropRect.y * scale
    const cw = cropRect.w * scale
    const ch = cropRect.h * scale

    ctx.save()
    ctx.beginPath()
    ctx.rect(cx, cy, cw, ch)
    ctx.clip()
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height)
    ctx.restore()

    // Crop border
    ctx.strokeStyle = 'var(--accent, #6366f1)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.strokeRect(cx, cy, cw, ch)
    ctx.setLineDash([])

    // Grid lines (rule of thirds)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + (cw / 3) * i, cy)
      ctx.lineTo(cx + (cw / 3) * i, cy + ch)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, cy + (ch / 3) * i)
      ctx.lineTo(cx + cw, cy + (ch / 3) * i)
      ctx.stroke()
    }

    // Corner handles
    const hs = 10
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = 'var(--accent, #6366f1)'
    ctx.lineWidth = 2
    const corners = [
      [cx - hs / 2, cy - hs / 2],
      [cx + cw - hs / 2, cy - hs / 2],
      [cx - hs / 2, cy + ch - hs / 2],
      [cx + cw - hs / 2, cy + ch - hs / 2],
    ]
    corners.forEach(([hx, hy]) => {
      ctx.fillRect(hx, hy, hs, hs)
      ctx.strokeRect(hx, hy, hs, hs)
    })
  }, [cropping, imageObj, cropRect, getDisplayScale])

  // ── Crop mouse/touch handlers ─────────────────────────────────
  const getCropEventPos = useCallback((e) => {
    const canvas = cropCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const handleCropPointerDown = useCallback((e) => {
    e.preventDefault()
    const pos = getCropEventPos(e)
    const scale = getDisplayScale()
    const cx = cropRect.x * scale
    const cy = cropRect.y * scale
    const cw = cropRect.w * scale
    const ch = cropRect.h * scale
    const hs = 14

    // Check corners
    const corners = [
      { type: 'nw', hx: cx, hy: cy },
      { type: 'ne', hx: cx + cw, hy: cy },
      { type: 'sw', hx: cx, hy: cy + ch },
      { type: 'se', hx: cx + cw, hy: cy + ch },
    ]
    for (const c of corners) {
      if (Math.abs(pos.x - c.hx) < hs && Math.abs(pos.y - c.hy) < hs) {
        setDragging(true)
        setDragType(c.type)
        setDragStart(pos)
        setCropInitRect({ ...cropRect })
        return
      }
    }

    // Check inside crop area → move
    if (pos.x >= cx && pos.x <= cx + cw && pos.y >= cy && pos.y <= cy + ch) {
      setDragging(true)
      setDragType('move')
      setDragStart(pos)
      setCropInitRect({ ...cropRect })
    }
  }, [cropRect, getCropEventPos, getDisplayScale])

  const handleCropPointerMove = useCallback((e) => {
    if (!dragging || !imageObj) return
    e.preventDefault()
    const pos = getCropEventPos(e)
    const scale = getDisplayScale()
    const dx = (pos.x - dragStart.x) / scale
    const dy = (pos.y - dragStart.y) / scale
    const natW = imageObj.naturalWidth
    const natH = imageObj.naturalHeight
    const minSize = 40

    if (dragType === 'move') {
      const nx = clamp(cropInitRect.x + dx, 0, natW - cropInitRect.w)
      const ny = clamp(cropInitRect.y + dy, 0, natH - cropInitRect.h)
      setCropRect({ ...cropInitRect, x: nx, y: ny })
    } else {
      let { x, y, w, h } = cropInitRect

      if (dragType === 'se') {
        w = clamp(w + dx, minSize, natW - x)
        if (aspectRatio) {
          h = w / aspectRatio
          if (y + h > natH) { h = natH - y; w = h * aspectRatio }
        } else {
          h = clamp(h + dy, minSize, natH - y)
        }
      } else if (dragType === 'sw') {
        const newX = clamp(x + dx, 0, x + w - minSize)
        w = w - (newX - x)
        x = newX
        if (aspectRatio) {
          h = w / aspectRatio
          if (y + h > natH) { h = natH - y; w = h * aspectRatio; x = cropInitRect.x + cropInitRect.w - w }
        } else {
          h = clamp(h + dy, minSize, natH - y)
        }
      } else if (dragType === 'ne') {
        w = clamp(w + dx, minSize, natW - x)
        if (aspectRatio) {
          const newH = w / aspectRatio
          const newY = y + h - newH
          if (newY < 0) { h = y + h; w = h * aspectRatio } else { y = newY; h = newH }
        } else {
          const newY = clamp(y + dy, 0, y + h - minSize)
          h = h - (newY - y)
          y = newY
        }
      } else if (dragType === 'nw') {
        const newX = clamp(x + dx, 0, x + w - minSize)
        w = w - (newX - x)
        x = newX
        if (aspectRatio) {
          const newH = w / aspectRatio
          const newY = y + h - newH
          if (newY < 0) { h = y + h; w = h * aspectRatio; x = cropInitRect.x + cropInitRect.w - w } else { y = newY; h = newH }
        } else {
          const newY = clamp(y + dy, 0, y + h - minSize)
          h = h - (newY - y)
          y = newY
        }
      }

      setCropRect({ x, y, w: Math.max(w, minSize), h: Math.max(h, minSize) })
    }
  }, [dragging, dragType, dragStart, cropInitRect, imageObj, aspectRatio, getCropEventPos, getDisplayScale])

  const handleCropPointerUp = useCallback(() => {
    setDragging(false)
    setDragType(null)
  }, [])

  // ── Apply aspect ratio ────────────────────────────────────────
  const handleAspectRatioChange = useCallback((ratio) => {
    setAspectRatio(ratio)
    if (!imageObj) return
    const natW = imageObj.naturalWidth
    const natH = imageObj.naturalHeight

    if (ratio === null) return

    // Fit largest crop with that ratio centered in image
    let cw, ch
    if (natW / natH > ratio) {
      ch = natH
      cw = ch * ratio
    } else {
      cw = natW
      ch = cw / ratio
    }
    setCropRect({
      x: (natW - cw) / 2,
      y: (natH - ch) / 2,
      w: cw,
      h: ch,
    })
  }, [imageObj])

  // ── Confirm crop ──────────────────────────────────────────────
  const handleConfirmCrop = useCallback(() => {
    if (!imageObj) return
    const offscreen = document.createElement('canvas')
    offscreen.width = Math.round(cropRect.w)
    offscreen.height = Math.round(cropRect.h)
    const ctx = offscreen.getContext('2d')
    ctx.drawImage(
      imageObj,
      cropRect.x, cropRect.y, cropRect.w, cropRect.h,
      0, 0, offscreen.width, offscreen.height
    )
    const dataUrl = offscreen.toDataURL('image/png')
    const croppedImg = new Image()
    croppedImg.onload = () => {
      setCroppedImage(croppedImg)
      setCropping(false)
    }
    croppedImg.src = dataUrl
  }, [imageObj, cropRect])

  // ── Preview canvas rendering ──────────────────────────────────
  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas || !croppedImage) return

    canvas.width = croppedImage.naturalWidth
    canvas.height = croppedImage.naturalHeight
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(croppedImage, 0, 0)

    // Text rendering helper
    const drawMemeText = (text, yPos) => {
      if (!text) return
      const scaledFontSize = (fontSize / 500) * canvas.width
      const actualFontSize = Math.max(scaledFontSize, 14)
      ctx.font = `bold ${actualFontSize}px Impact, 'Arial Black', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = yPos < canvas.height / 2 ? 'top' : 'bottom'
      ctx.fillStyle = textColor
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = Math.max(actualFontSize / 12, 2)
      ctx.lineJoin = 'round'
      ctx.miterLimit = 2

      // Word-wrap
      const maxWidth = canvas.width * 0.9
      const words = text.split(' ')
      const lines = []
      let currentLine = ''
      for (const word of words) {
        const test = currentLine ? currentLine + ' ' + word : word
        if (ctx.measureText(test).width > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = test
        }
      }
      if (currentLine) lines.push(currentLine)

      const lineHeight = actualFontSize * 1.15
      lines.forEach((line, i) => {
        const ly = yPos < canvas.height / 2
          ? yPos + i * lineHeight
          : yPos - (lines.length - 1 - i) * lineHeight
        ctx.strokeText(line, canvas.width / 2, ly)
        ctx.fillText(line, canvas.width / 2, ly)
      })
    }

    const padding = canvas.height * 0.04
    drawMemeText(topText.toUpperCase(), padding)
    drawMemeText(bottomText.toUpperCase(), canvas.height - padding)
  }, [croppedImage, topText, bottomText, fontSize, textColor, strokeColor])

  // ── Download ──────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  // ── Reset ─────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setImageSrc(null)
    setImageObj(null)
    setCropping(false)
    setCroppedImage(null)
    setCropRect({ x: 0, y: 0, w: 0, h: 0 })
    setAspectRatio(null)
    setTopText('')
    setBottomText('')
    setFontSize(42)
    setTextColor('#ffffff')
    setStrokeColor('#000000')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  // ── Styles ────────────────────────────────────────────────────
  const styles = {
    uploadArea: {
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-md)',
      cursor: 'pointer',
      background: 'var(--bg-input)',
      transition: 'border-color 0.2s, background 0.2s',
      minHeight: '260px',
      textAlign: 'center',
    },
    uploadIcon: {
      fontSize: '3rem',
      opacity: 0.5,
    },
    uploadLabel: {
      color: 'var(--text-secondary)',
      fontSize: '1rem',
    },
    uploadHint: {
      color: 'var(--text-muted)',
      fontSize: '0.82rem',
    },
    cropContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: '#111',
    },
    cropCanvas: {
      display: 'block',
      width: '100%',
      cursor: dragging ? 'grabbing' : 'crosshair',
      touchAction: 'none',
    },
    ratioBar: {
      display: 'flex',
      gap: 'var(--space-xs)',
      flexWrap: 'wrap',
      marginBottom: 'var(--space-md)',
    },
    ratioBtn: (active) => ({
      padding: '6px 16px',
      borderRadius: 'var(--radius-sm)',
      border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
      background: active ? 'var(--accent-light)' : 'var(--bg-input)',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      cursor: 'pointer',
      fontWeight: active ? 700 : 500,
      fontSize: '0.85rem',
      transition: 'all 0.15s',
    }),
    previewCanvas: {
      display: 'block',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      background: '#111',
    },
    colorPickerWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
    },
    colorInput: {
      width: '40px',
      height: '40px',
      border: '2px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      padding: 0,
      background: 'none',
    },
    slider: {
      width: '100%',
      accentColor: 'var(--accent)',
    },
    controlsCard: {
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
    },
    sectionTitle: {
      fontWeight: 700,
      fontSize: '0.95rem',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
    },
    actionBar: {
      display: 'flex',
      gap: 'var(--space-sm)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-md)',
    },
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

          {/* ── Upload area (no image yet) ── */}
          {!imageSrc && (
            <div
              style={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent)' }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.style.borderColor = 'var(--border)'
                const file = e.dataTransfer.files?.[0]
                if (file && file.type.startsWith('image/')) {
                  const dt = new DataTransfer()
                  dt.items.add(file)
                  fileInputRef.current.files = dt.files
                  handleFileChange({ target: { files: dt.files } })
                }
              }}
            >
              <div style={styles.uploadIcon}>🖼️</div>
              <div style={styles.uploadLabel}>Click or drag & drop an image to get started</div>
              <div style={styles.uploadHint}>Supports JPG, PNG, GIF, WebP</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* ── Cropping UI ── */}
          {cropping && imageObj && (
            <div>
              <div style={styles.sectionTitle}>
                <span>✂️</span> Crop your image
              </div>
              <div style={{ marginTop: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <div style={styles.ratioBar}>
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.label}
                      style={styles.ratioBtn(
                        ar.value === aspectRatio || (ar.value === null && aspectRatio === null)
                      )}
                      onClick={() => handleAspectRatioChange(ar.value)}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={cropContainerRef} style={styles.cropContainer}>
                <canvas
                  ref={cropCanvasRef}
                  style={styles.cropCanvas}
                  onMouseDown={handleCropPointerDown}
                  onMouseMove={handleCropPointerMove}
                  onMouseUp={handleCropPointerUp}
                  onMouseLeave={handleCropPointerUp}
                  onTouchStart={handleCropPointerDown}
                  onTouchMove={handleCropPointerMove}
                  onTouchEnd={handleCropPointerUp}
                />
              </div>
              <div style={styles.actionBar}>
                <button className="btn btn-primary" onClick={handleConfirmCrop}>
                  ✅ Apply Crop
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  setCropRect({ x: 0, y: 0, w: imageObj.naturalWidth, h: imageObj.naturalHeight })
                  setAspectRatio(null)
                }}>
                  ↩️ Reset Crop
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  // Skip cropping, use original
                  setCroppedImage(imageObj)
                  setCropping(false)
                }}>
                  ⏭️ Skip Crop
                </button>
              </div>
            </div>
          )}

          {/* ── Editor: Preview + Controls ── */}
          {croppedImage && !cropping && (
            <>
              <div className="row" style={{ gap: 'var(--space-lg)', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Preview */}
                <div style={{ flex: '1 1 340px', minWidth: 0 }}>
                  <div style={{ ...styles.sectionTitle, marginBottom: 'var(--space-sm)' }}>
                    <span>🎨</span> Preview
                  </div>
                  <canvas ref={previewCanvasRef} style={styles.previewCanvas} />
                </div>

                {/* Controls */}
                <div style={{ flex: '0 0 300px', maxWidth: '100%' }}>
                  <div style={styles.controlsCard}>
                    <div style={styles.sectionTitle}>
                      <span>✏️</span> Text Overlay
                    </div>

                    <div className="form-group">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Top Text
                      </label>
                      <input
                        type="text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        placeholder="e.g. When the code works…"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Bottom Text
                      </label>
                      <input
                        type="text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        placeholder="e.g. …on the first try"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div className="divider" />

                    <div style={styles.sectionTitle}>
                      <span>🎛️</span> Style
                    </div>

                    <div className="form-group">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        style={styles.slider}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Text Color
                      </label>
                      <div style={styles.colorPickerWrap}>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          style={styles.colorInput}
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{textColor}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Stroke Color
                      </label>
                      <div style={styles.colorPickerWrap}>
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          style={styles.colorInput}
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{strokeColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div style={styles.actionBar}>
                <button className="btn btn-primary" onClick={handleDownload}>
                  ⬇️ Download Meme
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  setCropping(true)
                  setCroppedImage(null)
                }}>
                  ✂️ Re-Crop
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  🔄 Start Over
                </button>
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

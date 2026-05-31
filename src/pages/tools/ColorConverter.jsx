import { useState, useCallback } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'color-converter')

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return { r, g, b }
}
function rgbToHex(r,g,b) {
  return '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('')
}
function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h, s, l=(max+min)/2
  if(max===min){h=s=0}else{
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min)
    if(max===r) h=((g-b)/d+(g<b?6:0))/6
    else if(max===g) h=((b-r)/d+2)/6
    else h=((r-g)/d+4)/6
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }
}
function hslToRgb(h,s,l) {
  s/=100; l/=100
  const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l)
  const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)))
  return { r: Math.round(f(0)*255), g: Math.round(f(8)*255), b: Math.round(f(4)*255) }
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#6366f1')
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 })
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 })

  const updateFromHex = useCallback((h) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(h)) return
    const r = hexToRgb(h)
    setHex(h); setRgb(r); setHsl(rgbToHsl(r.r,r.g,r.b))
  }, [])

  const updateFromRgb = useCallback((r,g,b) => {
    const rr = Math.max(0,Math.min(255,parseInt(r)||0))
    const gg = Math.max(0,Math.min(255,parseInt(g)||0))
    const bb = Math.max(0,Math.min(255,parseInt(b)||0))
    setRgb({r:rr,g:gg,b:bb}); setHex(rgbToHex(rr,gg,bb)); setHsl(rgbToHsl(rr,gg,bb))
  }, [])

  const updateFromHsl = useCallback((h,s,l) => {
    const hh=Math.max(0,Math.min(360,parseInt(h)||0))
    const ss=Math.max(0,Math.min(100,parseInt(s)||0))
    const ll=Math.max(0,Math.min(100,parseInt(l)||0))
    const r=hslToRgb(hh,ss,ll)
    setHsl({h:hh,s:ss,l:ll}); setRgb(r); setHex(rgbToHex(r.r,r.g,r.b))
  }, [])

  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          {/* Color preview + picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
            <div className="color-preview" style={{ background: hex, height: 120 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <input type="color" value={hex} onChange={e => updateFromHex(e.target.value)}
                style={{ width: 60, height: 60, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to pick</span>
            </div>
          </div>

          {/* HEX */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>HEX</label>
              <CopyButton text={hex} />
            </div>
            <input type="text" value={hex} onChange={e => updateFromHex(e.target.value.startsWith('#') ? e.target.value : '#'+e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }} />
          </div>

          {/* RGB */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>RGB</label>
              <CopyButton text={rgbStr} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {['r','g','b'].map(ch => (
                <div key={ch} className="form-group">
                  <label style={{ fontSize: '0.75rem', color: ch==='r'?'#ef4444':ch==='g'?'#10b981':'#6366f1' }}>{ch.toUpperCase()} (0-255)</label>
                  <input type="number" min={0} max={255} value={rgb[ch]}
                    onChange={e => updateFromRgb(ch==='r'?e.target.value:rgb.r, ch==='g'?e.target.value:rgb.g, ch==='b'?e.target.value:rgb.b)} />
                </div>
              ))}
            </div>
          </div>

          {/* HSL */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>HSL</label>
              <CopyButton text={hslStr} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[['h','Hue (0-360)',360],['s','Saturation (0-100)',100],['l','Lightness (0-100)',100]].map(([ch,lbl,max]) => (
                <div key={ch} className="form-group">
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lbl}</label>
                  <input type="number" min={0} max={max} value={hsl[ch]}
                    onChange={e => updateFromHsl(ch==='h'?e.target.value:hsl.h, ch==='s'?e.target.value:hsl.s, ch==='l'?e.target.value:hsl.l)} />
                </div>
              ))}
            </div>
          </div>

          {/* All formats */}
          <div style={{ background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>All Formats</div>
            {[['HEX', hex], ['RGB', rgbStr], ['HSL', hslStr], ['CSS Variable', `--color: ${hex};`]].map(([name, val]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 100 }}>{name}</span>
                <code style={{ fontSize: '0.85rem', color: 'var(--accent-light)', flex: 1, margin: '0 1rem' }}>{val}</code>
                <CopyButton text={val} />
              </div>
            ))}
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

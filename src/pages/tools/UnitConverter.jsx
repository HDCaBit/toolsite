import { useState } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'unit-converter')

const units = {
  Length: {
    Meter: 1, Kilometer: 1e3, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34,
    Yard: 0.9144, Foot: 0.3048, Inch: 0.0254, 'Nautical Mile': 1852,
  },
  Weight: {
    Kilogram: 1, Gram: 0.001, Milligram: 1e-6, Pound: 0.453592, Ounce: 0.0283495,
    Ton: 1000, 'Stone': 6.35029,
  },
  Temperature: { Celsius: 'c', Fahrenheit: 'f', Kelvin: 'k' },
  Area: {
    'Square Meter': 1, 'Square Kilometer': 1e6, 'Square Centimeter': 0.0001,
    'Square Mile': 2.58999e6, 'Square Yard': 0.836127, 'Square Foot': 0.092903,
    Hectare: 10000, Acre: 4046.86,
  },
  Volume: {
    Liter: 1, Milliliter: 0.001, 'Cubic Meter': 1000, Gallon: 3.78541,
    Quart: 0.946353, Pint: 0.473176, Cup: 0.24, 'Fluid Ounce': 0.0295735,
  },
  Speed: {
    'm/s': 1, 'km/h': 1/3.6, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048,
  },
}

function convertTemp(val, from, to) {
  if (from === to) return val
  let celsius = from === 'Celsius' ? val : from === 'Fahrenheit' ? (val - 32) * 5/9 : val - 273.15
  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * 9/5 + 32
  return celsius + 273.15
}

function convert(val, from, to, category) {
  if (category === 'Temperature') return convertTemp(parseFloat(val), from, to)
  const base = parseFloat(val) * units[category][from]
  return base / units[category][to]
}

export default function UnitConverter() {
  const categories = Object.keys(units)
  const [cat, setCat] = useState('Length')
  const [fromUnit, setFromUnit] = useState(Object.keys(units['Length'])[0])
  const [toUnit, setToUnit] = useState(Object.keys(units['Length'])[1])
  const [val, setVal] = useState('1')

  const catUnits = Object.keys(units[cat])
  const result = val !== '' && !isNaN(val) ? convert(val, fromUnit, toUnit, cat) : ''
  const formatted = result !== '' ? (Math.abs(result) < 0.0001 && result !== 0 ? result.toExponential(6) : parseFloat(result.toFixed(8)).toString()) : ''

  const handleCatChange = (c) => {
    setCat(c)
    const u = Object.keys(units[c])
    setFromUnit(u[0])
    setToUnit(u[1])
  }

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit) }

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          {/* Category tabs */}
          <div className="tabs" style={{ overflowX: 'auto' }}>
            {categories.map(c => (
              <button key={c} className={`tab-btn ${cat === c ? 'active' : ''}`} onClick={() => handleCatChange(c)}>{c}</button>
            ))}
          </div>

          {/* Converter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>From</label>
              <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                {catUnits.map(u => <option key={u}>{u}</option>)}
              </select>
              <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Enter value..." style={{ marginTop: 8 }} />
            </div>
            <button onClick={swap} className="btn btn-secondary btn-icon" title="Swap units" style={{ marginBottom: 0 }}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
            </button>
            <div className="form-group">
              <label>To</label>
              <select value={toUnit} onChange={e => setToUnit(e.target.value)}>
                {catUnits.map(u => <option key={u}>{u}</option>)}
              </select>
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--accent)', borderRadius: 8, padding: '10px 14px', marginTop: 8, fontFamily: 'var(--font-mono)', color: 'var(--accent-light)', fontWeight: 600 }}>
                {formatted || '—'}
              </div>
            </div>
          </div>

          {formatted && (
            <div className="big-result">
              <div className="number">{formatted}</div>
              <div className="label">{toUnit}</div>
              <div style={{ marginTop: 8 }}>
                <CopyButton text={formatted} />
              </div>
            </div>
          )}

          {/* Quick reference table */}
          {val && !isNaN(val) && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>All {cat} Conversions for {val} {fromUnit}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {catUnits.filter(u => u !== fromUnit).map(u => {
                  const r = convert(val, fromUnit, u, cat)
                  const f = Math.abs(r) < 0.0001 && r !== 0 ? r.toExponential(4) : parseFloat(r.toFixed(6)).toString()
                  return (
                    <div key={u} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{f}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{u}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

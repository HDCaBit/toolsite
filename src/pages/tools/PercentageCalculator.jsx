import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPercent, faEquals, faArrowUp, faArrowDown, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'percentage-calculator')

const MODES = [
  { id: 'percent-of', label: 'X% of Y', icon: faPercent },
  { id: 'is-what-percent', label: 'X is what % of Y', icon: faEquals },
  { id: 'percent-change', label: '% Change', icon: faArrowUp },
]

export default function PercentageCalculator() {
  const [mode, setMode] = useState('percent-of')
  const [inputs, setInputs] = useState({ x: '', y: '' })
  const [result, setResult] = useState(null)

  const handleInput = useCallback((key, val) => {
    setInputs(prev => ({ ...prev, [key]: val }))
    setResult(null)
  }, [])

  const calculate = useCallback(() => {
    const x = parseFloat(inputs.x)
    const y = parseFloat(inputs.y)

    if (isNaN(x) || isNaN(y)) {
      setResult({ error: 'Please enter valid numbers.' })
      return
    }

    if (mode === 'percent-of') {
      // What is X% of Y?
      const val = (x / 100) * y
      setResult({
        main: val.toLocaleString('en-US', { maximumFractionDigits: 6 }),
        label: `${x}% of ${y}`,
        extra: `${x}% of ${y} = ${val.toLocaleString('en-US', { maximumFractionDigits: 6 })}`,
      })
    } else if (mode === 'is-what-percent') {
      // X is what % of Y?
      if (y === 0) { setResult({ error: 'Y cannot be zero.' }); return }
      const val = (x / y) * 100
      setResult({
        main: `${val.toLocaleString('en-US', { maximumFractionDigits: 6 })}%`,
        label: `${x} is what % of ${y}`,
        extra: `${x} is ${val.toLocaleString('en-US', { maximumFractionDigits: 6 })}% of ${y}`,
      })
    } else {
      // Percentage change from X to Y
      if (x === 0) { setResult({ error: 'Starting value (X) cannot be zero.' }); return }
      const val = ((y - x) / Math.abs(x)) * 100
      const isIncrease = val >= 0
      setResult({
        main: `${val >= 0 ? '+' : ''}${val.toLocaleString('en-US', { maximumFractionDigits: 6 })}%`,
        label: `From ${x} to ${y}`,
        extra: `${isIncrease ? 'Increase' : 'Decrease'} of ${Math.abs(val).toLocaleString('en-US', { maximumFractionDigits: 6 })}%`,
        isIncrease,
      })
    }
  }, [inputs, mode])

  const reset = () => {
    setInputs({ x: '', y: '' })
    setResult(null)
  }

  const getLabels = () => {
    if (mode === 'percent-of') return { x: 'Percentage (X)', y: 'Number (Y)', xPlaceholder: 'e.g. 25', yPlaceholder: 'e.g. 200' }
    if (mode === 'is-what-percent') return { x: 'Value (X)', y: 'Total (Y)', xPlaceholder: 'e.g. 50', yPlaceholder: 'e.g. 200' }
    return { x: 'From (X)', y: 'To (Y)', xPlaceholder: 'e.g. 100', yPlaceholder: 'e.g. 150' }
  }

  const labels = getLabels()

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
          {/* Mode Tabs */}
          <div className="tabs">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`tab-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => { setMode(m.id); reset() }}
              >
                <FontAwesomeIcon icon={m.icon} style={{ marginRight: 6 }} />
                {m.label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="row" style={{ gap: 16, marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>{labels.x}</label>
              <input
                type="number"
                className="form-control"
                placeholder={labels.xPlaceholder}
                value={inputs.x}
                onChange={e => handleInput('x', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && calculate()}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>{labels.y}</label>
              <input
                type="number"
                className="form-control"
                placeholder={labels.yPlaceholder}
                value={inputs.y}
                onChange={e => handleInput('y', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && calculate()}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button className="btn btn-primary" onClick={calculate}>
              <FontAwesomeIcon icon={faEquals} style={{ marginRight: 8 }} />
              Calculate
            </button>
            <button className="btn btn-secondary" onClick={reset}>
              <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: 8 }} />
              Reset
            </button>
          </div>

          {/* Result */}
          {result && (
            result.error ? (
              <div className="result-box" style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)' }}>
                {result.error}
              </div>
            ) : (
              <div className="big-result">
                <div
                  className="number"
                  style={result.isIncrease === false ? { color: '#f87171' } : result.isIncrease === true ? { color: '#34d399' } : {}}
                >
                  {result.isIncrease === true && <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: 8, fontSize: '0.6em' }} />}
                  {result.isIncrease === false && <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: 8, fontSize: '0.6em' }} />}
                  {result.main}
                </div>
                <div className="label">{result.label}</div>
                {result.extra && (
                  <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {result.extra}
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  <CopyButton text={result.main} />
                </div>
              </div>
            )
          )}

          {/* Quick Reference */}
          <div style={{ marginTop: 24 }}>
            <div className="divider" style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }} />
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Quick Reference
            </h3>
            <div className="row" style={{ gap: 10 }}>
              {[
                { label: '10% of 200', calc: () => { setMode('percent-of'); setInputs({ x: '10', y: '200' }); setResult(null) } },
                { label: '50 is what % of 200', calc: () => { setMode('is-what-percent'); setInputs({ x: '50', y: '200' }); setResult(null) } },
                { label: '100 → 150 change', calc: () => { setMode('percent-change'); setInputs({ x: '100', y: '150' }); setResult(null) } },
              ].map(ex => (
                <button
                  key={ex.label}
                  className="btn btn-secondary btn-sm"
                  onClick={() => { ex.calc(); setTimeout(calculate, 50) }}
                  style={{ flex: '1 1 auto' }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

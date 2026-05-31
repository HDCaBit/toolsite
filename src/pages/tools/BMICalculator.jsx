import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWeightScale, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'bmi-calculator')

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', range: '< 18.5' }
  if (bmi < 25)   return { label: 'Normal weight', color: '#34d399', bg: 'rgba(52,211,153,0.12)', range: '18.5 – 24.9' }
  if (bmi < 30)   return { label: 'Overweight', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', range: '25 – 29.9' }
  return { label: 'Obese', color: '#f87171', bg: 'rgba(248,113,113,0.12)', range: '≥ 30' }
}

const BMI_SCALE = [
  { label: 'Underweight', max: 18.5, color: '#60a5fa' },
  { label: 'Normal', max: 25, color: '#34d399' },
  { label: 'Overweight', max: 30, color: '#fbbf24' },
  { label: 'Obese', max: 40, color: '#f87171' },
]

export default function BMICalculator() {
  const [metric, setMetric] = useState(true)
  // Metric
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  // Imperial
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightLbs, setWeightLbs] = useState('')

  const results = useMemo(() => {
    let heightM, weightKgVal
    if (metric) {
      heightM = parseFloat(heightCm) / 100
      weightKgVal = parseFloat(weightKg)
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)
      heightM = totalInches * 0.0254
      weightKgVal = parseFloat(weightLbs) * 0.453592
    }
    if (!heightM || !weightKgVal || isNaN(heightM) || isNaN(weightKgVal) || heightM <= 0 || weightKgVal <= 0) return null
    const bmi = weightKgVal / (heightM * heightM)
    const category = getBMICategory(bmi)
    // Healthy weight range for height
    const minKg = 18.5 * heightM * heightM
    const maxKg = 24.9 * heightM * heightM
    const minLbs = minKg / 0.453592
    const maxLbs = maxKg / 0.453592
    return { bmi, category, minKg, maxKg, minLbs, maxLbs, heightM }
  }, [metric, heightCm, weightKg, heightFt, heightIn, weightLbs])

  // BMI position on scale (0-40 range)
  const bmiPos = results ? Math.min(Math.max(results.bmi, 0), 40) : null
  const scalePercent = bmiPos !== null ? (bmiPos / 40) * 100 : null

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
          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button
              className={`btn ${metric ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMetric(true)}
            >Metric (cm, kg)</button>
            <button
              className={`btn ${!metric ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMetric(false)}
            >Imperial (ft/in, lbs)</button>
          </div>

          {/* Inputs */}
          {metric ? (
            <div className="row" style={{ gap: 16, marginBottom: 20 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Height (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="175"
                  min="50"
                  max="300"
                  value={heightCm}
                  onChange={e => setHeightCm(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="70"
                  min="1"
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="row" style={{ gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 100px' }}>
                <label>Height (ft)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="5"
                  min="0"
                  max="9"
                  value={heightFt}
                  onChange={e => setHeightFt(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 100px' }}>
                <label>Height (in)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="9"
                  min="0"
                  max="11"
                  step="0.1"
                  value={heightIn}
                  onChange={e => setHeightIn(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 140px' }}>
                <label>Weight (lbs)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="154"
                  min="1"
                  value={weightLbs}
                  onChange={e => setWeightLbs(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {results ? (
            <>
              {/* BMI Big Number */}
              <div className="big-result" style={{ background: results.category.bg, border: `1px solid ${results.category.color}30` }}>
                <div className="number" style={{ color: results.category.color }}>
                  {results.bmi.toFixed(1)}
                </div>
                <div className="label">Your BMI</div>
                <div style={{
                  display: 'inline-block',
                  marginTop: 10,
                  padding: '4px 16px',
                  background: results.category.color + '25',
                  border: `1px solid ${results.category.color}50`,
                  borderRadius: 100,
                  color: results.category.color,
                  fontWeight: 700,
                  fontSize: '1rem',
                }}>
                  {results.category.label}
                </div>
              </div>

              {/* BMI Scale */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 6, position: 'relative' }}>
                  {BMI_SCALE.map((s, i) => {
                    const prev = i === 0 ? 0 : BMI_SCALE[i - 1].max
                    const w = ((s.max - prev) / 40) * 100
                    return <div key={s.label} style={{ width: `${w}%`, background: s.color, opacity: 0.7 }} />
                  })}
                  {/* Pointer */}
                  <div style={{
                    position: 'absolute',
                    left: `${scalePercent}%`,
                    top: -4,
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 24,
                    background: 'white',
                    borderRadius: 2,
                    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Underweight<br />&lt;18.5</span>
                  <span style={{ textAlign: 'center' }}>Normal<br />18.5–25</span>
                  <span style={{ textAlign: 'center' }}>Overweight<br />25–30</span>
                  <span style={{ textAlign: 'right' }}>Obese<br />30+</span>
                </div>
              </div>

              {/* Healthy weight range */}
              <div style={{
                background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  <FontAwesomeIcon icon={faWeightScale} style={{ marginRight: 6 }} />
                  Healthy Weight Range for your height
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {metric
                    ? `${results.minKg.toFixed(1)} kg — ${results.maxKg.toFixed(1)} kg`
                    : `${results.minLbs.toFixed(1)} lbs — ${results.maxLbs.toFixed(1)} lbs`
                  }
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  BMI range: {results.category.range}
                </div>
              </div>

              {/* BMI categories table */}
              <div style={{ marginTop: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Category</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>BMI Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Underweight', range: '< 18.5', color: '#60a5fa' },
                      { label: 'Normal weight', range: '18.5 – 24.9', color: '#34d399' },
                      { label: 'Overweight', range: '25 – 29.9', color: '#fbbf24' },
                      { label: 'Obese', range: '≥ 30', color: '#f87171' },
                    ].map(cat => (
                      <tr key={cat.label} style={{
                        borderBottom: '1px solid var(--border)',
                        background: results.category.label === cat.label ? cat.color + '12' : 'transparent',
                      }}>
                        <td style={{ padding: '8px 12px', color: cat.color, fontWeight: results.category.label === cat.label ? 700 : 400 }}>
                          {results.category.label === cat.label ? '▶ ' : ''}{cat.label}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{cat.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 12 }}>
                <CopyButton text={`BMI: ${results.bmi.toFixed(1)} (${results.category.label})\nHealthy range: ${results.minKg.toFixed(1)}–${results.maxKg.toFixed(1)} kg`} />
              </div>
            </>
          ) : (
            <div style={{
              background: 'var(--bg-input)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
              padding: 32, textAlign: 'center', color: 'var(--text-muted)',
            }}>
              <FontAwesomeIcon icon={faWeightScale} style={{ fontSize: '2rem', marginBottom: 12 }} />
              <p>Enter your height and weight to calculate BMI</p>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

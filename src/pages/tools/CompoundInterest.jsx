import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'compound-interest')

const FREQUENCIES = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Semi-Annually', value: 2 },
  { label: 'Annually', value: 1 },
]

const fmt = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('7')
  const [freq, setFreq] = useState(12)
  const [years, setYears] = useState('10')
  const [monthlyContrib, setMonthlyContrib] = useState('0')

  const results = useMemo(() => {
    const P = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const n = freq
    const t = parseFloat(years)
    const pmt = parseFloat(monthlyContrib) || 0

    if (isNaN(P) || isNaN(r) || isNaN(t) || P < 0 || t <= 0) return null

    const rows = []
    for (let y = 1; y <= Math.min(t, 50); y++) {
      // Compound interest: A = P*(1+r/n)^(n*t)
      const futureValue = P * Math.pow(1 + r / n, n * y)
      // Future value of monthly contributions
      const pmtFV = pmt > 0
        ? pmt * ((Math.pow(1 + r / 12, 12 * y) - 1) / (r / 12))
        : 0
      const total = futureValue + pmtFV
      const contributed = P + pmt * 12 * y
      const interest = total - contributed
      rows.push({ year: y, total, interest, contributed })
    }

    const last = rows[rows.length - 1]
    return {
      futureValue: last.total,
      totalInterest: last.interest,
      totalContributed: last.contributed,
      rows,
    }
  }, [principal, rate, freq, years, monthlyContrib])

  const reset = () => {
    setPrincipal('10000')
    setRate('7')
    setFreq(12)
    setYears('10')
    setMonthlyContrib('0')
  }

  const maxTotal = results ? Math.max(...results.rows.map(r => r.total)) : 1

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
          <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label>Principal ($)</label>
              <input type="number" className="form-control" placeholder="10000" min="0" value={principal} onChange={e => setPrincipal(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 120px' }}>
              <label>Annual Rate (%)</label>
              <input type="number" className="form-control" placeholder="7" min="0" step="0.01" value={rate} onChange={e => setRate(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 120px' }}>
              <label>Years</label>
              <input type="number" className="form-control" placeholder="10" min="1" max="50" value={years} onChange={e => setYears(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label>Monthly Contribution ($)</label>
              <input type="number" className="form-control" placeholder="0" min="0" value={monthlyContrib} onChange={e => setMonthlyContrib(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Compounding Frequency</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FREQUENCIES.map(f => (
                <button
                  key={f.value}
                  className={`btn btn-sm ${freq === f.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFreq(f.value)}
                  style={{ flex: '1 1 auto' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <button className="btn btn-secondary btn-sm" onClick={reset}>
              <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: 6 }} />Reset
            </button>
          </div>

          {results ? (
            <>
              <div className="big-result">
                <div className="number">{fmt(results.futureValue)}</div>
                <div className="label">Future Value after {years} year{years !== '1' ? 's' : ''}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Principal', value: fmt(parseFloat(principal) || 0) },
                  { label: 'Contributions', value: fmt(results.totalContributed - (parseFloat(principal) || 0)) },
                  { label: 'Interest Earned', value: fmt(results.totalInterest), green: true },
                  { label: 'Total Deposited', value: fmt(results.totalContributed) },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.green ? '#34d399' : 'var(--text-primary)' }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth chart (bar chart with CSS) */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  <FontAwesomeIcon icon={faChartLine} style={{ marginRight: 6 }} />
                  Year-by-Year Growth
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120, marginBottom: 8 }}>
                  {results.rows.map((row) => {
                    const totalH = (row.total / maxTotal) * 100
                    const interestH = (row.interest / maxTotal) * 100
                    const principalH = totalH - interestH
                    return (
                      <div key={row.year} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'default' }} title={`Year ${row.year}: ${fmt(row.total)}`}>
                        <div style={{ background: '#34d399', height: `${interestH}%`, borderRadius: '2px 2px 0 0' }} />
                        <div style={{ background: 'var(--accent)', height: `${principalH}%` }} />
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--accent)', borderRadius: 2, marginRight: 4 }} />Principal + Contributions</span>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#34d399', borderRadius: 2, marginRight: 4 }} />Interest Earned</span>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Year', 'Total Value', 'Interest Earned', 'Total Deposited'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, i) => (
                      <tr key={row.year} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-input)' }}>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{row.year}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-light)', fontWeight: 600 }}>{fmt(row.total)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#34d399' }}>{fmt(row.interest)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{fmt(row.contributed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12 }}>
                <CopyButton text={`Future Value: ${fmt(results.futureValue)}\nInterest Earned: ${fmt(results.totalInterest)}\nTotal Deposited: ${fmt(results.totalContributed)}`} />
              </div>
            </>
          ) : (
            <div style={{
              background: 'var(--bg-input)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
              padding: 32, textAlign: 'center', color: 'var(--text-muted)',
            }}>
              <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '2rem', marginBottom: 12 }} />
              <p>Enter your investment details to see growth</p>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

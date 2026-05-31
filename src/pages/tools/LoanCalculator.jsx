import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCalculator, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'loan-calculator')

function calcMonthlyPayment(principal, annualRate, years) {
  if (annualRate === 0) return principal / (years * 12)
  const r = annualRate / 100 / 12
  const n = years * 12
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function buildAmortization(principal, annualRate, years) {
  const n = years * 12
  const r = annualRate / 100 / 12
  const monthly = calcMonthlyPayment(principal, annualRate, years)
  let balance = principal
  const rows = []
  for (let i = 1; i <= Math.min(n, 12); i++) {
    const interest = balance * r
    const principalPaid = monthly - interest
    balance = Math.max(0, balance - principalPaid)
    rows.push({ month: i, payment: monthly, principal: principalPaid, interest, balance })
  }
  return rows
}

const fmt = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('200000')
  const [interestRate, setInterestRate] = useState('7')
  const [loanTerm, setLoanTerm] = useState('30')

  const results = useMemo(() => {
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    const years = parseFloat(loanTerm)
    if (!principal || !years || isNaN(principal) || isNaN(years) || principal <= 0 || years <= 0) return null
    const r = isNaN(rate) ? 0 : rate
    const monthly = calcMonthlyPayment(principal, r, years)
    const totalPaid = monthly * years * 12
    const totalInterest = totalPaid - principal
    const table = buildAmortization(principal, r, years)
    return { monthly, totalPaid, totalInterest, table, principal }
  }, [loanAmount, interestRate, loanTerm])

  const reset = () => { setLoanAmount('200000'); setInterestRate('7'); setLoanTerm('30') }

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
          <div className="row" style={{ gap: 16, marginBottom: 4 }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label>
                <FontAwesomeIcon icon={faHouse} style={{ marginRight: 6, color: 'var(--accent-light)' }} />
                Loan Amount ($)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="200000"
                min="0"
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Interest Rate (%)</label>
              <input
                type="number"
                className="form-control"
                placeholder="7"
                min="0"
                step="0.01"
                value={interestRate}
                onChange={e => setInterestRate(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Loan Term (Years)</label>
              <input
                type="number"
                className="form-control"
                placeholder="30"
                min="1"
                max="50"
                value={loanTerm}
                onChange={e => setLoanTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button className="btn btn-secondary btn-sm" onClick={reset}>
              <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: 6 }} />Reset
            </button>
          </div>

          {results ? (
            <>
              {/* Monthly Payment Big Display */}
              <div className="big-result">
                <div className="number">{fmt(results.monthly)}</div>
                <div className="label">Monthly Payment</div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Loan Amount', value: fmt(results.principal) },
                  { label: 'Total Interest', value: fmt(results.totalInterest), highlight: true },
                  { label: 'Total Payment', value: fmt(results.totalPaid) },
                  { label: 'Loan Term', value: `${loanTerm} years` },
                ].map(s => (
                  <div
                    key={s.label}
                    style={{
                      background: 'var(--bg-input)',
                      border: `1px solid ${s.highlight ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{
                      fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: s.highlight ? '#f87171' : 'var(--text-primary)',
                    }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Interest vs Principal bar */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Principal {((results.principal / results.totalPaid) * 100).toFixed(1)}%</span>
                  <span>Interest {((results.totalInterest / results.totalPaid) * 100).toFixed(1)}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
                  <div style={{
                    width: `${(results.principal / results.totalPaid) * 100}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                  }} />
                  <div style={{
                    flex: 1,
                    background: 'rgba(248,113,113,0.5)',
                  }} />
                </div>
              </div>

              {/* Amortization Table */}
              <div>
                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  <FontAwesomeIcon icon={faCalculator} style={{ marginRight: 6 }} />
                  Amortization Schedule (First 12 Months)
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.table.map((row, i) => (
                        <tr key={row.month} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-input)' }}>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{row.month}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{fmt(row.payment)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#34d399' }}>{fmt(row.principal)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#f87171' }}>{fmt(row.interest)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 12 }}>
                  <CopyButton text={`Monthly Payment: ${fmt(results.monthly)}\nTotal Interest: ${fmt(results.totalInterest)}\nTotal Payment: ${fmt(results.totalPaid)}`} />
                </div>
              </div>
            </>
          ) : (
            <div style={{
              background: 'var(--bg-input)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
              padding: 32, textAlign: 'center', color: 'var(--text-muted)',
            }}>
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: '2rem', marginBottom: 12 }} />
              <p>Enter loan details above to calculate</p>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

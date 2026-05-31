import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faUser, faDollarSign, faPercent } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'tip-calculator')

const PRESET_TIPS = [10, 15, 18, 20, 25]

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPercent, setTipPercent] = useState(15)
  const [customTip, setCustomTip] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [people, setPeople] = useState(1)

  const effectiveTip = useCustom ? (parseFloat(customTip) || 0) : tipPercent

  const results = useMemo(() => {
    const billVal = parseFloat(bill)
    if (!bill || isNaN(billVal) || billVal <= 0) return null
    const ppl = Math.max(1, parseInt(people) || 1)
    const tipAmt = billVal * (effectiveTip / 100)
    const total = billVal + tipAmt
    const perPerson = total / ppl
    const tipPerPerson = tipAmt / ppl
    return {
      tipAmount: tipAmt,
      totalBill: total,
      perPerson,
      tipPerPerson,
      people: ppl,
    }
  }, [bill, effectiveTip, people])

  const fmt = (val) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

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
          {/* Bill Amount */}
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: 6, color: 'var(--accent-light)' }} />
              Bill Amount
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={bill}
              onChange={e => setBill(e.target.value)}
              style={{ fontSize: '1.2rem' }}
            />
          </div>

          {/* Tip Percentage */}
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faPercent} style={{ marginRight: 6, color: 'var(--accent-light)' }} />
              Tip Percentage
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {PRESET_TIPS.map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${!useCustom && tipPercent === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setTipPercent(p); setUseCustom(false) }}
                  style={{ flex: '1 1 auto', minWidth: 56 }}
                >
                  {p}%
                </button>
              ))}
              <button
                className={`btn btn-sm ${useCustom ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUseCustom(true)}
                style={{ flex: '1 1 auto', minWidth: 56 }}
              >
                Custom
              </button>
            </div>
            {useCustom && (
              <input
                type="number"
                className="form-control"
                placeholder="Enter tip %"
                min="0"
                max="100"
                value={customTip}
                onChange={e => setCustomTip(e.target.value)}
                autoFocus
              />
            )}
            {!useCustom && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Selected: <strong style={{ color: 'var(--accent-light)' }}>{tipPercent}%</strong>
              </div>
            )}
          </div>

          {/* Number of People */}
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: 6, color: 'var(--accent-light)' }} />
              Number of People
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPeople(p => Math.max(1, parseInt(p) - 1))}
                style={{ width: 36, height: 36, padding: 0, fontSize: '1.2rem' }}
              >−</button>
              <input
                type="number"
                className="form-control"
                min="1"
                max="100"
                value={people}
                onChange={e => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: 80, textAlign: 'center' }}
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPeople(p => parseInt(p) + 1)}
                style={{ width: 36, height: 36, padding: 0, fontSize: '1.2rem' }}
              >+</button>
            </div>
          </div>

          {/* Results */}
          {results ? (
            <div style={{ marginTop: 24 }}>
              {/* Per Person highlighted */}
              <div className="big-result">
                <div className="number">{fmt(results.perPerson)}</div>
                <div className="label">Per Person {results.people > 1 ? `(${results.people} people)` : ''}</div>
              </div>

              {/* Breakdown */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 12,
                marginTop: 16,
              }}>
                {[
                  { label: 'Bill Amount', value: fmt(parseFloat(bill)), icon: faDollarSign },
                  { label: `Tip (${effectiveTip}%)`, value: fmt(results.tipAmount), icon: faPercent },
                  { label: 'Total Bill', value: fmt(results.totalBill), icon: faReceipt },
                  ...(results.people > 1 ? [
                    { label: 'Tip / Person', value: fmt(results.tipPerPerson), icon: faPercent },
                  ] : []),
                ].map(item => (
                  <div
                    key={item.label}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <FontAwesomeIcon icon={item.icon} style={{ marginRight: 6 }} />
                      {item.label}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <CopyButton text={`Per person: ${fmt(results.perPerson)}\nTip: ${fmt(results.tipAmount)}\nTotal: ${fmt(results.totalBill)}`} />
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-input)',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: 24,
            }}>
              <FontAwesomeIcon icon={faReceipt} style={{ fontSize: '2rem', marginBottom: 12 }} />
              <p>Enter a bill amount to see the split</p>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

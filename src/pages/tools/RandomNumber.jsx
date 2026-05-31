import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faCoins, faList, faBolt } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'random-number')

const DICE_TYPES = [
  { label: '1d6', sides: 6, count: 1 },
  { label: '2d6', sides: 6, count: 2 },
  { label: '1d20', sides: 20, count: 1 },
  { label: '1d12', sides: 12, count: 1 },
  { label: '1d100', sides: 100, count: 1 },
]

function rollDice(count, sides) {
  const rolls = []
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1)
  return rolls
}

export default function RandomNumber() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [result, setResult] = useState(null)
  const [diceRolls, setDiceRolls] = useState(null)
  const [diceLabel, setDiceLabel] = useState('')
  const [coin, setCoin] = useState(null)
  const [listCount, setListCount] = useState(10)
  const [listResult, setListResult] = useState([])
  const [unique, setUnique] = useState(false)

  const generate = useCallback(() => {
    const n = Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min)
    setResult(n)
  }, [min, max])

  const handleDice = useCallback((dice) => {
    setDiceRolls(rollDice(dice.count, dice.sides))
    setDiceLabel(dice.label)
  }, [])

  const flipCoin = useCallback(() => {
    setCoin(Math.random() < 0.5 ? 'Heads' : 'Tails')
  }, [])

  const generateList = useCallback(() => {
    const count = Math.min(Number(listCount), 1000)
    const minN = Number(min), maxN = Number(max)
    const range = maxN - minN + 1
    if (unique && count > range) {
      alert('Cannot generate more unique numbers than the range allows.')
      return
    }
    const nums = []
    if (unique) {
      const pool = []
      for (let i = minN; i <= maxN; i++) pool.push(i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
      nums.push(...pool.slice(0, count))
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + minN)
      }
    }
    setListResult(nums)
  }, [min, max, listCount, unique])

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
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Random Number
            </div>
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label>Minimum</label>
                <input type="number" value={min} onChange={e => setMin(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Maximum</label>
                <input type="number" value={max} onChange={e => setMax(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={generate} style={{ width: '100%', marginBottom: 16 }}>
              <FontAwesomeIcon icon={faBolt} />
              Generate Number
            </button>
            {result !== null && (
              <div className="big-result">
                <div className="number">{result.toLocaleString()}</div>
                <div className="label">between {min} and {max}</div>
              </div>
            )}
          </div>

          <div className="divider" />

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              <FontAwesomeIcon icon={faDice} style={{ marginRight: 8 }} />
              Dice Roller
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {DICE_TYPES.map(d => (
                <button key={d.label} className="btn btn-secondary" onClick={() => handleDice(d)}>
                  <FontAwesomeIcon icon={faDice} /> Roll {d.label}
                </button>
              ))}
            </div>
            {diceRolls && (
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{diceLabel}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {diceRolls.map((roll, i) => (
                    <div key={i} style={{
                      width: 56, height: 56,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-card)',
                      border: '2px solid var(--accent)',
                      borderRadius: 10,
                      fontSize: '1.4rem', fontWeight: 800,
                      color: 'var(--accent-light)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {roll}
                    </div>
                  ))}
                  {diceRolls.length > 1 && (
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                      Total: <strong style={{ color: 'var(--text-primary)' }}>{diceRolls.reduce((a, b) => a + b, 0)}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                <FontAwesomeIcon icon={faCoins} style={{ marginRight: 8 }} />
                Coin Flip
              </div>
              <button className="btn btn-secondary" onClick={flipCoin}>
                <FontAwesomeIcon icon={faCoins} /> Flip Coin
              </button>
            </div>
            {coin && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-input)',
                border: `1px solid ${coin === 'Heads' ? '#10b981' : '#f59e0b'}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 20px',
                fontSize: '1.1rem', fontWeight: 700,
                color: coin === 'Heads' ? '#10b981' : '#f59e0b',
                marginTop: 28,
              }}>
                {coin === 'Heads' ? '🪙' : '🔄'} {coin}
              </div>
            )}
          </div>

          <div className="divider" />

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              <FontAwesomeIcon icon={faList} style={{ marginRight: 8 }} />
              Generate List
            </div>
            <div className="row" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label>How many numbers?</label>
                <input type="number" min={1} max={1000} value={listCount} onChange={e => setListCount(e.target.value)} />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 22 }}>
                  <input type="checkbox" id="unique-chk" checked={unique} onChange={e => setUnique(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <label htmlFor="unique-chk" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Unique values only
                  </label>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={generateList} style={{ marginBottom: 16 }}>
              <FontAwesomeIcon icon={faList} /> Generate List
            </button>
            {listResult.length > 0 && (
              <div style={{
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '14px 18px',
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                color: 'var(--text-secondary)', maxHeight: 200, overflowY: 'auto',
                wordBreak: 'break-all', lineHeight: 2,
              }}>
                {listResult.join(', ')}
              </div>
            )}
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

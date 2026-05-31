import { useState } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'number-base')

const BASES = [
  { label: 'Binary (Base 2)', short: 'BIN', base: 2, color: '#10b981', chars: '01' },
  { label: 'Octal (Base 8)', short: 'OCT', base: 8, color: '#f59e0b', chars: '0-7' },
  { label: 'Decimal (Base 10)', short: 'DEC', base: 10, color: '#6366f1', chars: '0-9' },
  { label: 'Hexadecimal (Base 16)', short: 'HEX', base: 16, color: '#ec4899', chars: '0-9, A-F' },
]

function groupBinary(bin) {
  return bin.replace(/(.{1,4})(?=(.{4})+$)/g, '$1 ')
}

export default function NumberBaseConverter() {
  const [inputBase, setInputBase] = useState(10)
  const [value, setValue] = useState('255')
  const [error, setError] = useState('')

  const handleChange = (v) => {
    setValue(v)
    if (!v) { setError(''); return }
    try {
      const n = parseInt(v, inputBase)
      if (isNaN(n)) { setError(`Invalid characters for base ${inputBase}`); return }
      setError('')
    } catch { setError('Invalid input') }
  }

  const handleBaseChange = (base) => {
    setError('')
    if (!value) { setInputBase(base); return }
    try {
      const n = parseInt(value, inputBase)
      if (!isNaN(n)) {
        const converted = n.toString(base).toUpperCase()
        setValue(converted)
      }
    } catch {}
    setInputBase(base)
  }

  const decimal = value ? parseInt(value.toUpperCase(), inputBase) : NaN
  const isValid = !isNaN(decimal) && decimal >= 0

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          {/* Base selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {BASES.map(b => (
              <button
                key={b.base}
                className={`btn ${inputBase === b.base ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => handleBaseChange(b.base)}
                style={inputBase === b.base ? { background: b.color, borderColor: b.color } : {}}
              >
                {b.short}
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Enter {BASES.find(b => b.base === inputBase)?.label} Number</label>
            <input
              type="text"
              value={value}
              onChange={e => handleChange(e.target.value.toUpperCase())}
              placeholder={`Enter ${BASES.find(b=>b.base===inputBase)?.short} number...`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '0.05em', borderColor: error ? '#ef4444' : undefined }}
            />
            {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 4 }}>⚠ {error}</div>}
          </div>

          {isValid && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BASES.map(b => {
                const converted = decimal.toString(b.base).toUpperCase()
                const display = b.base === 2 ? groupBinary(converted) : converted
                return (
                  <div key={b.base} style={{
                    background: 'var(--bg-input)', border: `1px solid ${b.base === inputBase ? b.color : 'var(--border)'}`,
                    borderRadius: 10, padding: '1rem',
                    opacity: b.base === inputBase ? 1 : 0.85,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: b.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                          {b.short} — {b.label}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 600 }}>
                          {display}
                        </div>
                      </div>
                      <CopyButton text={converted} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faRefresh, faShield } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'password-generator')

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length, options) {
  let charset = ''
  if (options.uppercase) charset += CHARS.uppercase
  if (options.lowercase) charset += CHARS.lowercase
  if (options.numbers) charset += CHARS.numbers
  if (options.symbols) charset += CHARS.symbols
  if (!charset) charset = CHARS.lowercase

  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, n => charset[n % charset.length]).join('')
}

function getStrength(password, options) {
  if (!password) return { label: '', score: 0, color: '' }
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (options.uppercase && /[A-Z]/.test(password)) score++
  if (options.lowercase && /[a-z]/.test(password)) score++
  if (options.numbers && /[0-9]/.test(password)) score++
  if (options.symbols && /[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', score: 25, color: '#ef4444' }
  if (score <= 3) return { label: 'Fair', score: 50, color: '#f59e0b' }
  if (score <= 4) return { label: 'Strong', score: 75, color: '#10b981' }
  return { label: 'Very Strong', score: 100, color: '#6366f1' }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState([])

  const generate = useCallback(() => {
    const pwd = generatePassword(length, options)
    setPassword(pwd)
    setHistory(prev => [pwd, ...prev].slice(0, 5))
  }, [length, options])

  const toggleOption = (key) => {
    setOptions(prev => {
      const next = { ...prev, [key]: !prev[key] }
      // Ensure at least one option is selected
      if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) return prev
      return next
    })
  }

  const strength = getStrength(password, options)

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
          {/* Length */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Password Length</span>
              <span style={{ color: 'var(--accent-light)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem' }}>
                {length}
              </span>
            </label>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={e => setLength(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>8</span><span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Character Sets</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { key: 'uppercase', label: 'Uppercase', example: 'A–Z' },
                { key: 'lowercase', label: 'Lowercase', example: 'a–z' },
                { key: 'numbers', label: 'Numbers', example: '0–9' },
                { key: 'symbols', label: 'Symbols', example: '!@#$%' },
              ].map(({ key, label, example }) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '10px 14px',
                    background: options[key] ? 'rgba(99,102,241,0.1)' : 'var(--bg-input)',
                    border: `1px solid ${options[key] ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={() => toggleOption(key)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {example}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button className="btn btn-primary btn-lg" onClick={generate} style={{ width: '100%', marginBottom: '20px', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faRefresh} />
            Generate Password
          </button>

          {/* Result */}
          {password && (
            <>
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.05rem',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                  letterSpacing: '0.05em',
                }}>
                  {password}
                </span>
                <CopyButton text={password} />
              </div>

              {/* Strength */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FontAwesomeIcon icon={faShield} />
                    Password Strength
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${strength.score}%`,
                      background: `linear-gradient(90deg, ${strength.color}, ${strength.color}aa)`,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <div className="divider" style={{ margin: '0 0 16px 0' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                <FontAwesomeIcon icon={faKey} style={{ marginRight: '6px' }} />
                Recent Passwords
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((pwd, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      opacity: i === 0 ? 1 : 0.6,
                    }}
                  >
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      wordBreak: 'break-all',
                    }}>
                      {pwd}
                    </span>
                    <CopyButton text={pwd} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

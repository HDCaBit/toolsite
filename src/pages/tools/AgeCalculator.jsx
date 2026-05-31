import { useState } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'age-calculator')

export default function AgeCalculator() {
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    if (!dob) return
    const birth = new Date(dob)
    const now = new Date()
    if (birth > now) { setResult(null); return }

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate() }
    if (months < 0) { years--; months += 12 }

    const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24))
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    // Next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1)
    const daysToB = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24))

    setResult({ years, months, days, totalDays, totalHours: totalHours.toLocaleString(), totalMinutes: totalMinutes.toLocaleString(), daysToB, nextBirthdayYear: nextBirthday.getFullYear() })
  }

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="dob-input">Date of Birth</label>
            <input id="dob-input" type="date" value={dob} onChange={e => setDob(e.target.value)} max={maxDate} style={{ maxWidth: 280 }} />
          </div>
          <button className="btn btn-primary btn-lg" onClick={calculate} disabled={!dob}>
            Calculate My Age
          </button>

          {result && (
            <>
              <div className="divider" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Years', value: result.years, color: 'var(--color-developer)' },
                  { label: 'Months', value: result.months, color: 'var(--color-converter)' },
                  { label: 'Days', value: result.days, color: 'var(--color-text)' },
                ].map(s => (
                  <div key={s.label} className="big-result" style={{ padding: '1rem' }}>
                    <div className="number" style={{ fontSize: '2.5rem', color: s.color }}>{s.value}</div>
                    <div className="label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Days Lived', value: result.totalDays.toLocaleString() },
                  { label: 'Total Hours', value: result.totalHours },
                  { label: 'Total Minutes', value: result.totalMinutes },
                  { label: `Days to Birthday ${result.nextBirthdayYear}`, value: result.daysToB },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

import { useState, useMemo } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'timezone-converter')

const TIMEZONES = [
  { city: 'Jakarta', tz: 'Asia/Jakarta', flag: '🇮🇩' },
  { city: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'London', tz: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
  { city: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Mumbai', tz: 'Asia/Kolkata', flag: '🇮🇳' },
]

function formatTime(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, month: 'short', day: 'numeric', year: 'numeric',
  }).format(date)
}

function formatTimeOnly(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(date)
}

export default function TimezoneConverter() {
  const now = new Date()
  const [date, setDate] = useState(now.toISOString().split('T')[0])
  const [time, setTime] = useState(now.toTimeString().slice(0,5))
  const [fromTz, setFromTz] = useState('Asia/Jakarta')
  const [toTz, setToTz] = useState('America/New_York')

  const converted = useMemo(() => {
    try {
      const localDt = new Date(`${date}T${time}:00`)
      const fromOffset = new Intl.DateTimeFormat('en', { timeZone: fromTz, timeZoneName: 'shortOffset' }).formatToParts(localDt).find(p => p.type === 'timeZoneName')?.value || ''
      const result = formatTime(localDt, toTz)
      return { result, error: null }
    } catch (e) { return { result: '', error: e.message } }
  }, [date, time, fromTz, toTz])

  const worldNow = useMemo(() => {
    const now = new Date()
    return TIMEZONES.map(z => ({ ...z, time: formatTimeOnly(now, z.tz) }))
  }, [])

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div className="row" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>From Timezone</label>
              <select value={fromTz} onChange={e => setFromTz(e.target.value)}>
                {TIMEZONES.map(z => <option key={z.tz} value={z.tz}>{z.flag} {z.city} ({z.tz})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>To Timezone</label>
              <select value={toTz} onChange={e => setToTz(e.target.value)}>
                {TIMEZONES.map(z => <option key={z.tz} value={z.tz}>{z.flag} {z.city} ({z.tz})</option>)}
              </select>
            </div>
          </div>

          {converted.result && (
            <div className="big-result" style={{ marginBottom: '1.5rem' }}>
              <div className="number" style={{ fontSize: '1.5rem' }}>{converted.result}</div>
              <div className="label">{toTz}</div>
              <div style={{ marginTop: 8 }}><CopyButton text={converted.result} /></div>
            </div>
          )}

          <div className="divider" />

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} /> World Clock — Current Time
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {worldNow.map(z => (
                <div key={z.city} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{z.flag} {z.city}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{z.tz}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-light)' }}>{z.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

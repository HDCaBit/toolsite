import { useEffect } from 'react'
import './AdBanner.css'

// ============================================================
// KONFIGURASI ADS
// ============================================================
const AD_CONFIG = {
  publisherId: 'ca-pub-4397471641666167',
  slots: {
    leaderboard_top:    '5233331756',
    leaderboard_bottom: '9200496925',
    sidebar_top:        '4919001367',
    sidebar_bottom:     '2292838026',
  }
}

const isSlotReady = (slotId) => slotId && !slotId.startsWith('SLOT_ID_')

// ── Leaderboard Unit (top/bottom) ─────────────────────────
// Pakai data-ad-format="horizontal" → Google hanya serve
// format horizontal (728x90 desktop / 320x50 mobile)
// TANPA data-full-width-responsive agar tidak melebar jadi kotak
function LeaderboardUnit({ slotId }) {
  useEffect(() => {
    if (!isSlotReady(slotId)) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [slotId])

  if (!isSlotReady(slotId)) return null

  return (
    <ins
      className="adsbygoogle ad-ins-leaderboard"
      style={{ display: 'inline-block' }}
      data-ad-client={AD_CONFIG.publisherId}
      data-ad-slot={slotId}
      data-ad-format="horizontal"
    />
  )
}

// ── Rectangle Unit (sidebar) ──────────────────────────────
function RectangleUnit({ slotId }) {
  useEffect(() => {
    if (!isSlotReady(slotId)) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [slotId])

  if (!isSlotReady(slotId)) return null

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
      data-ad-client={AD_CONFIG.publisherId}
      data-ad-slot={slotId}
    />
  )
}

// ── Banner atas/bawah ─────────────────────────────────────
export default function AdBanner({ position = 'top' }) {
  const slotId = position === 'top'
    ? AD_CONFIG.slots.leaderboard_top
    : AD_CONFIG.slots.leaderboard_bottom

  return (
    <div className={`ad-banner-wrap ad-${position}`} aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <div className="ad-leaderboard-wrap">
        <LeaderboardUnit slotId={slotId} />
      </div>
    </div>
  )
}

// ── Sidebar ads ───────────────────────────────────────────
export function AdSidebar({ position = 'top' }) {
  const slotId = position === 'top'
    ? AD_CONFIG.slots.sidebar_top
    : AD_CONFIG.slots.sidebar_bottom

  return (
    <div className="ad-sidebar-wrap" aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <RectangleUnit slotId={slotId} />
    </div>
  )
}

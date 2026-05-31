import { useEffect } from 'react'
import './AdBanner.css'

// ============================================================
// KONFIGURASI ADS — Isi slot ID setelah dapat dari AdSense
// Cara buat ad unit: AdSense Dashboard → Ads → By ad unit
// → Display ads → beri nama → copy data-ad-slot
// ============================================================
const AD_CONFIG = {
  publisherId: 'ca-pub-4397471641666167',
  slots: {
    // Leaderboard 728x90 — di atas header (top banner)
    leaderboard_top: '5233331756',
    // Leaderboard 728x90 — di bawah footer (bottom banner)
    leaderboard_bottom: '9200496925',
    // Medium Rectangle 300x250 — sidebar atas
    sidebar_top: '4919001367',
    // Medium Rectangle 300x250 — sidebar bawah
    sidebar_bottom: '2292838026',
  }
}

// Cek apakah slot sudah dikonfigurasi (bukan placeholder)
const isSlotReady = (slotId) => slotId && !slotId.startsWith('SLOT_ID_')

function AdUnit({ slotId, format = 'auto', style = {}, className = '' }) {
  useEffect(() => {
    // Jalankan adsbygoogle.push setelah komponen mount
    if (isSlotReady(slotId)) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        // AdSense belum siap / belum diapprove
      }
    }
  }, [slotId])

  if (!isSlotReady(slotId)) {
    // Tampilkan placeholder jika slot belum dikonfigurasi
    return (
      <div className={`ad-placeholder-banner ${className}`} style={style}>
        <span>Ad slot belum dikonfigurasi — isi AD_CONFIG di AdBanner.jsx</span>
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={AD_CONFIG.publisherId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}

// Banner atas/bawah — Leaderboard 728x90
export default function AdBanner({ position = 'top' }) {
  const slotId = position === 'top'
    ? AD_CONFIG.slots.leaderboard_top
    : AD_CONFIG.slots.leaderboard_bottom

  return (
    <div className={`ad-banner-wrap ad-${position}`} aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <div className="ad-leaderboard-wrap">
        <AdUnit
          slotId={slotId}
          format="horizontal"
          style={{ minWidth: 320, maxWidth: 728, height: 90 }}
        />
      </div>
    </div>
  )
}

// Sidebar ads — Medium Rectangle 300x250
export function AdSidebar({ position = 'top' }) {
  const slotId = position === 'top'
    ? AD_CONFIG.slots.sidebar_top
    : AD_CONFIG.slots.sidebar_bottom

  return (
    <div className="ad-sidebar-wrap" aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <AdUnit
        slotId={slotId}
        format="rectangle"
        style={{ width: 300, height: 250 }}
      />
    </div>
  )
}

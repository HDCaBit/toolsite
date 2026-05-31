import './AdBanner.css'

export default function AdBanner({ position = 'top' }) {
  // Replace the data-ad-slot value with your actual Google AdSense slot ID
  // To activate: uncomment the <ins> tag and remove the placeholder div
  return (
    <div className={`ad-banner-wrap ad-${position}`} aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <div className="ad-placeholder-banner">
        {/* 
          ACTIVATE ADS: Replace this div with:
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true">
          </ins>
          And add this script to index.html:
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
        */}
        <span>Leaderboard Ad · 728×90 · Place AdSense code here</span>
      </div>
    </div>
  )
}

export function AdSidebar() {
  return (
    <div className="ad-sidebar-wrap" aria-label="Advertisement">
      <div className="ad-label-text">Advertisement</div>
      <div className="ad-placeholder-box">
        <span>Ad · 300×250</span>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faMusic } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'playlist-name')

const db = {
  lofi: {
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    words1: ['late night', 'midnight', 'rainy', 'chill', 'coffee', 'study', 'sleepy', 'cozy', 'warm', 'soft'],
    words2: ['vibes', 'beats', 'tapes', 'sessions', 'hours', 'thoughts', 'dreams', 'escape', 'mood', 'tunes'],
    templates: ['[w1] [w2]', 'pov: [w1] [w2]', 'just [w1]', 'a [w1] night', '[w1] and chill']
  },
  indie: {
    color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    words1: ['bedroom', 'summer', 'sunset', 'indie', 'nostalgic', 'golden', 'vintage', 'sunny', 'fuzzy', 'lost'],
    words2: ['pop', 'days', 'kids', 'dreams', 'memories', 'sounds', 'vibes', 'tunes', 'youth', 'nights'],
    templates: ['[w1] [w2]', 'coming of age [w2]', 'main character [w2]', 'that [w1] feeling', '[w1] summer']
  },
  rnb: {
    color: 'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
    words1: ['late night', 'smooth', 'velvet', 'slow', 'deep', 'soul', 'midnight', 'sweet', 'soft', 'night'],
    words2: ['jams', 'r&b', 'drive', 'feels', 'vibes', 'groove', 'mood', 'thoughts', 'love', 'tunes'],
    templates: ['[w1] [w2]', 'in my [w2]', '[w1] thoughts', 'late night [w2]', 'smooth [w2]']
  },
  pop: {
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    words1: ['weekend', 'happy', 'dance', 'upbeat', 'sugar', 'bubblegum', 'bright', 'fun', 'catchy', 'radio'],
    words2: ['hits', 'pop', 'bops', 'vibes', 'anthems', 'tunes', 'energy', 'mix', 'party', 'smash'],
    templates: ['[w1] [w2]', 'just [w2]', 'pure [w1]', '[w1] energy', 'weekend [w2]']
  },
  rock: {
    color: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    words1: ['classic', 'hard', 'electric', 'rebel', 'heavy', 'garage', 'grunge', 'alt', 'noisy', 'wild'],
    words2: ['anthems', 'guitars', 'rock', 'noise', 'rebellion', 'energy', 'vibes', 'jams', 'records', 'riffs'],
    templates: ['[w1] [w2]', 'turn it up', '[w1] energy', 'pure [w2]', 'garage [w2]']
  },
  sad: {
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    words1: ['broken', 'rainy', 'tears', 'lonely', 'midnight', 'sad', 'empty', 'crying', 'lost', 'dark'],
    words2: ['hours', 'thoughts', 'vibes', 'playlist', 'memories', 'feels', 'nights', 'heart', 'tears', 'echoes'],
    templates: ['[w1] [w2]', 'in my feels', 'crying in the club', 'pov: [w1]', 'late night [w2]']
  },
  gym: {
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    words1: ['beast', 'workout', 'pump', 'heavy', 'hype', 'sweat', 'power', 'max', 'intense', 'gym'],
    words2: ['mode', 'motivation', 'energy', 'tunes', 'mix', 'beats', 'grind', 'hustle', 'anthems', 'gains'],
    templates: ['[w1] [w2]', 'pure [w1]', 'pre-workout [w2]', '[w1] energy', 'gym [w2]']
  },
  roadtrip: {
    color: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    words1: ['highway', 'scenic', 'endless', 'sunset', 'summer', 'open', 'desert', 'coastal', 'night', 'long'],
    words2: ['drive', 'roads', 'trip', 'vibes', 'tunes', 'journey', 'mix', 'adventure', 'miles', 'escape'],
    templates: ['[w1] [w2]', 'windows down', 'driving through the [w1]', 'route 66 [w2]', '[w1] drive']
  },
  study: {
    color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    words1: ['deep', 'focus', 'quiet', 'calm', 'library', 'ambient', 'soft', 'coffee', 'brain', 'study'],
    words2: ['focus', 'sessions', 'beats', 'vibes', 'tunes', 'flow', 'mode', 'hours', 'space', 'notes'],
    templates: ['[w1] [w2]', 'pure [w1]', 'get it done', '[w1] flow', 'library [w2]']
  },
  sleep: {
    color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    words1: ['dream', 'deep', 'soft', 'lullaby', 'peaceful', 'night', 'calm', 'gentle', 'drift', 'moon'],
    words2: ['sleep', 'dreams', 'waves', 'vibes', 'slumber', 'rest', 'ambience', 'clouds', 'stars', 'night'],
    templates: ['[w1] [w2]', 'fall asleep to [w1]', 'drift away', 'sweet [w2]', '[w1] dreams']
  },
  party: {
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    words1: ['house', 'crazy', 'weekend', 'wild', 'hype', 'dance', 'night', 'club', 'epic', 'lit'],
    words2: ['party', 'anthems', 'bangers', 'mix', 'vibes', 'tunes', 'hits', 'energy', 'jams', 'night'],
    templates: ['[w1] [w2]', 'pure [w2]', 'pre-game [w2]', '[w1] energy', 'turn up the [w2]']
  }
}

export default function PlaylistNameGen() {
  const [genre, setGenre] = useState('lofi')
  const [results, setResults] = useState([])
  const [animating, setAnimating] = useState(false)

  const generate = (g = genre) => {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)

    const data = db[g]
    const newResults = []
    
    for (let i = 0; i < 5; i++) {
      const w1 = data.words1[Math.floor(Math.random() * data.words1.length)]
      const w2 = data.words2[Math.floor(Math.random() * data.words2.length)]
      const template = data.templates[Math.floor(Math.random() * data.templates.length)]
      
      const name = template.replace('[w1]', w1).replace('[w2]', w2)
      // Capitalize first letter
      const finalName = name.charAt(0).toUpperCase() + name.slice(1)
      
      newResults.push(finalName)
    }
    setResults(newResults)
  }

  useEffect(() => {
    generate(genre)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre])

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <div className="tabs" style={{ marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {Object.keys(db).map(g => (
            <button
              key={g}
              className={`tab-btn ${genre === g ? 'active' : ''}`}
              onClick={() => setGenre(g)}
              style={{ textTransform: 'capitalize' }}
            >
              {g}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <button className="btn btn-primary btn-lg" onClick={() => generate(genre)}>
            <FontAwesomeIcon icon={faRotate} />
            Generate More Names
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--space-lg)',
          opacity: animating ? 0.5 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          {results.map((name, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}>
              {/* Cover Art Simulation */}
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: db[genre].color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FontAwesomeIcon icon={faMusic} style={{ fontSize: '3rem', opacity: 0.5 }} />
              </div>
              
              {/* Details */}
              <div style={{ padding: 'var(--space-md)' }}>
                <h3 style={{ 
                  margin: '0 0 var(--space-xs) 0', 
                  fontSize: '1.2rem',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }} title={name}>
                  {name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Playlist
                  </span>
                  <CopyButton text={name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ToolLayout>
    </>
  )
}

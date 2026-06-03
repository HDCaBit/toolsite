import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'username-generator')

const adjectives = ['Toxic', 'Lethal', 'Silent', 'Ghost', 'Neon', 'Cyber', 'Void', 'Crystal', 'Lunar', 'Solar', 'Epic', 'Fallen', 'Hidden', 'Savage', 'Mystic']
const nouns = ['Ninja', 'Dragon', 'Wolf', 'Sniper', 'Wraith', 'Blade', 'Phantom', 'Storm', 'Shadow', 'Knight', 'Raven', 'Viper', 'Nova', 'Echo', 'Frost']

const generators = {
  gaming: (name) => {
    const templates = [
      `xX_${name}_Xx`, `${name}_YT`, `TTV_${name}`, `FaZe_${name}`, `Not${name}`, 
      `Real${name}`, `${name}FPS`, `Im${name}`, `${name}Plays`, `The${name}`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },
  aesthetic: (name) => {
    const templates = [
      `✧${name}✧`, `·${name}·`, `꧁${name}꧂`, `ೃ⁀➷${name}`, `${name}ᵕ̈`, 
      `＊*•̩̩͙✩•̩̩͙*˚${name}˚*•̩̩͙✩•̩̩͙*˚＊`, `˗ˏˋ ${name} ˎˊ˗`, `⋆ ˚｡⋆୨୧˚${name}˚୨୧⋆｡˚ ⋆`, `•${name}•`, `— ${name}`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },
  kawaii: (name) => {
    const templates = [
      `♡${name}♡`, `☆${name}☆`, `~${name}~`, `✿${name}✿`, `🌸${name}🌸`,
      `${name}uwu`, `owo${name}`, `xoxo${name}`, `sweet${name}`, `baby${name}`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },
  hacker: (name) => {
    const leet = name.replace(/a/ig, '4').replace(/e/ig, '3').replace(/i/ig, '1').replace(/o/ig, '0').replace(/s/ig, '5')
    const templates = [
      leet, `[${name}]`, `<${name}>`, `sudo_${name}`, `root@${name}`,
      `sys.${name}`, `0x${name}`, `_${name}_`, `-${name}-`, `${leet}_x`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },
  dark: (name) => {
    const templates = [
      `†${name}†`, `⚔${name}⚔`, `☠${name}☠`, `🩸${name}🩸`, `Dark${name}`,
      `Blood${name}`, `Grim${name}`, `Soul${name}`, `Dead${name}`, `666${name}`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  },
  og: (name) => {
    const templates = [
      `${name}${Math.floor(Math.random() * 99)}`, `The${name}`, `Just${name}`, `x${name}`, `Its${name}`,
      `${name}Official`, `${name}HQ`, `Real${name}`, `${name}Life`, `${name}Daily`
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }
}

export default function UsernameGenerator() {
  const [seed, setSeed] = useState('')
  const [style, setStyle] = useState('gaming')
  const [results, setResults] = useState([])

  const generate = () => {
    const newResults = []
    for (let i = 0; i < 10; i++) {
      let baseName = seed.trim()
      if (!baseName) {
        baseName = adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)]
      }
      
      // Ensure no exact duplicates in the batch if possible, though random makes it rare
      let gen = generators[style](baseName)
      let attempts = 0
      while (newResults.includes(gen) && attempts < 10) {
        gen = generators[style](baseName)
        attempts++
      }
      newResults.push(gen)
    }
    setResults(newResults)
  }

  // Generate on mount or style change
  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style])

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <div className="form-group">
          <label>Seed Word or Name (Optional)</label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="e.g. Alex, Ninja, Shadow..."
              className="input-text"
              onKeyDown={(e) => e.key === 'Enter' && generate()}
            />
            <button className="btn btn-primary" onClick={generate}>
              <FontAwesomeIcon icon={faRotate} />
              Generate
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Style</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {Object.keys(generators).map(s => (
              <button
                key={s}
                className={`btn ${style === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStyle(s)}
                style={{ textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: 'var(--space-lg) 0' }}></div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {results.map((uname, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }} title={uname}>
                  {uname}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {uname.length} chars
                </span>
              </div>
              <CopyButton text={uname} />
            </div>
          ))}
        </div>
      </ToolLayout>
    </>
  )
}

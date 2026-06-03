import { useState } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'aesthetic-text')

const styles = [
  {
    name: 'Superscript',
    transform: (text) => {
      const map = { a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᵠ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ' }
      return text.toLowerCase().split('').map(c => map[c] || c).join('')
    }
  },
  {
    name: 'Double-struck',
    transform: (text) => {
      const diff = 0x1D552 - 0x61;
      const diffUpper = 0x1D538 - 0x41;
      return text.split('').map(c => {
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diffUpper)
        return c
      }).join('')
    }
  },
  {
    name: 'Cursive',
    transform: (text) => {
      const diff = 0x1D4B6 - 0x61;
      const diffUpper = 0x1D49C - 0x41;
      return text.split('').map(c => {
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diffUpper)
        return c
      }).join('')
    }
  },
  {
    name: 'Vaporwave',
    transform: (text) => text.split('').join('\u0336') + '\u0336'
  },
  {
    name: 'Bubble Filled',
    transform: (text) => {
      const diff = 0x1F150 - 0x41;
      return text.toUpperCase().split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        return c
      }).join('')
    }
  },
  {
    name: 'Bubble Outline',
    transform: (text) => {
      const diff = 0x24B6 - 0x41;
      const diffLower = 0x24D0 - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Small Caps',
    transform: (text) => {
      const map = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' }
      return text.toLowerCase().split('').map(c => map[c] || c).join('')
    }
  },
  {
    name: 'Bold',
    transform: (text) => {
      const diff = 0x1D5D4 - 0x41;
      const diffLower = 0x1D5EE - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Italic',
    transform: (text) => {
      const diff = 0x1D608 - 0x41;
      const diffLower = 0x1D622 - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Bold Italic',
    transform: (text) => {
      const diff = 0x1D63C - 0x41;
      const diffLower = 0x1D656 - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Monospace',
    transform: (text) => {
      const diff = 0x1D670 - 0x41;
      const diffLower = 0x1D68A - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Wide (Fullwidth)',
    transform: (text) => {
      const diff = 0xFF01 - 0x21;
      return text.split('').map(c => {
        if (c === ' ') return '　'
        if (c >= '!' && c <= '~') return String.fromCodePoint(c.charCodeAt(0) + diff)
        return c
      }).join('')
    }
  },
  {
    name: 'Upside Down',
    transform: (text) => {
      const map = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', '!': '¡', '?': '¿', '.': '˙', ',': "'", "'": ',', '"': '„', '_': '‾' }
      return text.toLowerCase().split('').reverse().map(c => map[c] || c).join('')
    }
  },
  {
    name: 'Gothic',
    transform: (text) => {
      const diff = 0x1D504 - 0x41;
      const diffLower = 0x1D51E - 0x61;
      return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.charCodeAt(0) + diffLower)
        return c
      }).join('')
    }
  },
  {
    name: 'Squares',
    transform: (text) => {
      const diff = 0x1F130 - 0x41;
      return text.toUpperCase().split('').map(c => {
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.charCodeAt(0) + diff)
        return c
      }).join('')
    }
  }
]

export default function AestheticText() {
  const [text, setText] = useState('Hello World')

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
          <label>Type your text here</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something cool..."
            rows={3}
            className="input-textarea"
            style={{ fontSize: '1.2rem', padding: '1rem' }}
          />
        </div>

        <div className="divider" style={{ margin: 'var(--space-lg) 0' }}></div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          {styles.map((style, i) => {
            const transformed = style.transform(text || 'Hello World')
            return (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {style.name}
                  </span>
                  <CopyButton text={transformed} />
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                  minHeight: '2rem'
                }}>
                  {transformed}
                </div>
              </div>
            )
          })}
        </div>
      </ToolLayout>
    </>
  )
}

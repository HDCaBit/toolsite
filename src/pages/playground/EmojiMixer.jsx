import { useState, useCallback } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'emoji-mixer')

const EMOJIS = ['😀','😂','🥰','😎','🤓','🥳','😈','👻','💀','☠️','👽','🤖','👾','🎃','🤡','👹','👺','💩','🤗','🤔','🤫','🤥','😴','🥱','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','👿','🐶','🐱','🐭','🐹','🐰','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','❤️','🔥','⭐','💫','✨','🌈','🎵','🎶','💎','🏆','🎯','🎪','🎭','🎨','🌹','🍕','🍔','🎮','🚀','💪','👑','🦋','🌙','🍀','🎂','🎁']

const COMBOS = {
  '❤️+🔥': { name: 'Burning Love', emoji: '💕🔥' },
  '😎+🤓': { name: 'Cool Nerd', emoji: '🧠✨' },
  '👻+💀': { name: 'Spooky Skeleton', emoji: '💀👻' },
  '🐶+🐱': { name: 'CatDog', emoji: '🐾' },
  '😂+💀': { name: 'Dead Laughing', emoji: '🪦😂' },
  '🔥+💎': { name: 'Fire Diamond', emoji: '💎🔥' },
  '🌈+✨': { name: 'Sparkle Rainbow', emoji: '🌈✨' },
  '🤖+👽': { name: 'Alien Robot', emoji: '🛸🤖' },
  '🎮+🔥': { name: 'Gamer on Fire', emoji: '🎮🔥' },
  '👑+💎': { name: 'Royal Diamond', emoji: '👑💎' },
  '🐶+🔥': { name: 'Hot Dog', emoji: '🌭' },
  '🐱+👻': { name: 'Ghost Cat', emoji: '😺👻' },
  '💪+🔥': { name: 'Power Blaze', emoji: '💪🔥' },
  '🚀+⭐': { name: 'Star Rocket', emoji: '🚀⭐' },
  '🦋+🌈': { name: 'Rainbow Butterfly', emoji: '🦋🌈' },
  '🌙+⭐': { name: 'Starry Night', emoji: '🌙⭐' },
  '🍕+🔥': { name: 'Fire Pizza', emoji: '🍕🔥' },
  '🍔+💎': { name: 'Burger Royale', emoji: '🍔👑' },
  '😀+😂': { name: 'Laughing Joy', emoji: '😆🤣' },
  '😀+🥰': { name: 'Happy Love', emoji: '🥰😊' },
  '😀+😎': { name: 'Happy Cool', emoji: '😎😃' },
  '😀+🔥': { name: 'Fired Up', emoji: '🔥😃' },
  '😂+🔥': { name: 'Roast Master', emoji: '🤣🔥' },
  '😂+😈': { name: 'Evil Laugh', emoji: '😈😂' },
  '🥰+💎': { name: 'Precious Love', emoji: '💖💎' },
  '🥰+🌹': { name: 'Romantic Rose', emoji: '🌹💕' },
  '🥰+❤️': { name: 'Deep Love', emoji: '💗💞' },
  '😎+🔥': { name: 'Too Cool', emoji: '😎🔥' },
  '😎+👑': { name: 'Cool King', emoji: '👑😎' },
  '😎+🚀': { name: 'Cool Launch', emoji: '🚀😎' },
  '🤓+💎': { name: 'Smart Diamond', emoji: '🧠💎' },
  '🤓+🎮': { name: 'Gamer Nerd', emoji: '🎮🧠' },
  '🤓+🚀': { name: 'Rocket Science', emoji: '🚀🧠' },
  '🥳+🎂': { name: 'Birthday Bash', emoji: '🎂🥳' },
  '🥳+🎁': { name: 'Party Gift', emoji: '🎁🎉' },
  '🥳+🎵': { name: 'Party Music', emoji: '🎶🥳' },
  '😈+🔥': { name: 'Hellfire', emoji: '😈🔥' },
  '😈+👻': { name: 'Demon Ghost', emoji: '👻😈' },
  '😈+💀': { name: 'Dark Death', emoji: '💀😈' },
  '👻+🎃': { name: 'Halloween Spook', emoji: '🎃👻' },
  '👻+🌙': { name: 'Midnight Ghost', emoji: '👻🌙' },
  '💀+☠️': { name: 'Double Death', emoji: '☠️💀' },
  '💀+🔥': { name: 'Fire Skull', emoji: '💀🔥' },
  '👽+🚀': { name: 'Space Alien', emoji: '🛸👽' },
  '👽+🌙': { name: 'Moon Alien', emoji: '🌙👽' },
  '🤖+🎮': { name: 'Robot Gamer', emoji: '🤖🎮' },
  '🤖+💎': { name: 'Cyber Gem', emoji: '💎🤖' },
  '👾+🎮': { name: 'Arcade Boss', emoji: '👾🕹️' },
  '👾+🚀': { name: 'Space Invader', emoji: '👾🚀' },
  '🎃+🌙': { name: 'Halloween Night', emoji: '🎃🌙' },
  '🎃+🔥': { name: 'Burning Pumpkin', emoji: '🎃🔥' },
  '🤡+🎪': { name: 'Circus Clown', emoji: '🤡🎪' },
  '🤡+🎭': { name: 'Theatre Fool', emoji: '🎭🤡' },
  '💩+🔥': { name: 'Dumpster Fire', emoji: '💩🔥' },
  '💩+👑': { name: 'Poop King', emoji: '💩👑' },
  '🤗+❤️': { name: 'Warm Hug', emoji: '🤗💕' },
  '🤔+💎': { name: 'Deep Thought', emoji: '🤔💡' },
  '🤑+💎': { name: 'Diamond Greed', emoji: '💰💎' },
  '🤑+👑': { name: 'Money King', emoji: '🤑👑' },
  '🤠+🔥': { name: 'Wild West Fire', emoji: '🤠🔥' },
  '🤠+🐶': { name: 'Cowboy Dog', emoji: '🤠🐕' },
  '🐶+❤️': { name: 'Puppy Love', emoji: '🐶❤️' },
  '🐶+👑': { name: 'King Dog', emoji: '🐶👑' },
  '🐱+❤️': { name: 'Cat Love', emoji: '🐱❤️' },
  '🐱+🐭': { name: 'Cat & Mouse', emoji: '🐱🐭' },
  '🐱+🌙': { name: 'Night Cat', emoji: '🐱🌙' },
  '🐭+🧀': { name: 'Cheese Hunter', emoji: '🐭🧀' },
  '🐹+❤️': { name: 'Cute Hamster', emoji: '🐹💕' },
  '🐰+🌹': { name: 'Bunny Rose', emoji: '🐰🌹' },
  '🐰+🍀': { name: 'Lucky Bunny', emoji: '🐰🍀' },
  '🐻+❤️': { name: 'Bear Hug', emoji: '🐻💕' },
  '🐼+🍀': { name: 'Lucky Panda', emoji: '🐼🍀' },
  '🐯+🔥': { name: 'Fire Tiger', emoji: '🐯🔥' },
  '🐯+👑': { name: 'Tiger King', emoji: '🐯👑' },
  '🦁+👑': { name: 'Lion King', emoji: '🦁👑' },
  '🦁+🔥': { name: 'Fire Lion', emoji: '🦁🔥' },
  '🐮+🌈': { name: 'Rainbow Cow', emoji: '🐮🌈' },
  '🐷+🍕': { name: 'Pizza Pig', emoji: '🐷🍕' },
  '🐸+👑': { name: 'Frog Prince', emoji: '🐸👑' },
  '🐸+☕': { name: 'Tea Frog', emoji: '🐸☕' },
  '🐵+🍌': { name: 'Banana Monkey', emoji: '🐵🍌' },
  '🐵+🚀': { name: 'Space Monkey', emoji: '🐵🚀' },
  '🙈+❤️': { name: 'Shy Love', emoji: '🙈❤️' },
  '🐔+🔥': { name: 'Fire Chicken', emoji: '🍗🔥' },
  '🐧+❄️': { name: 'Arctic Penguin', emoji: '🐧❄️' },
  '🐧+🌙': { name: 'Night Penguin', emoji: '🐧🌙' },
  '❤️+💎': { name: 'Diamond Heart', emoji: '💖💎' },
  '❤️+⭐': { name: 'Love Star', emoji: '❤️⭐' },
  '❤️+🌈': { name: 'Rainbow Love', emoji: '❤️🌈' },
  '❤️+🌙': { name: 'Moonlit Love', emoji: '❤️🌙' },
  '🔥+⭐': { name: 'Fire Star', emoji: '🌟🔥' },
  '🔥+✨': { name: 'Blazing Sparkle', emoji: '🔥✨' },
  '🔥+🌈': { name: 'Fire Rainbow', emoji: '🔥🌈' },
  '🔥+🚀': { name: 'Rocket Blaze', emoji: '🚀🔥' },
  '⭐+✨': { name: 'Stellar Sparkle', emoji: '⭐✨' },
  '⭐+💫': { name: 'Cosmic Star', emoji: '🌟💫' },
  '💫+✨': { name: 'Shimmer Dust', emoji: '✨💫' },
  '🌈+🎵': { name: 'Rainbow Melody', emoji: '🌈🎵' },
  '🌈+🦋': { name: 'Butterfly Rainbow', emoji: '🦋🌈' },
  '🎵+🎶': { name: 'Double Melody', emoji: '🎵🎶' },
  '🎵+❤️': { name: 'Love Song', emoji: '🎵❤️' },
  '💎+✨': { name: 'Sparkling Gem', emoji: '💎✨' },
  '💎+👑': { name: 'Crown Jewel', emoji: '💎👑' },
  '🏆+⭐': { name: 'Star Champion', emoji: '🏆⭐' },
  '🏆+🔥': { name: 'Fire Champion', emoji: '🏆🔥' },
  '🎯+🔥': { name: 'Bullseye Blaze', emoji: '🎯🔥' },
  '🎪+🎭': { name: 'Theatre Circus', emoji: '🎪🎭' },
  '🎨+🌈': { name: 'Rainbow Art', emoji: '🎨🌈' },
  '🎨+✨': { name: 'Sparkling Art', emoji: '🎨✨' },
  '🌹+❤️': { name: 'Rose Love', emoji: '🌹❤️' },
  '🌹+💎': { name: 'Diamond Rose', emoji: '🌹💎' },
  '🍕+🍔': { name: 'Fast Food Feast', emoji: '🍕🍔' },
  '🍕+❤️': { name: 'Pizza Love', emoji: '🍕❤️' },
  '🍔+🔥': { name: 'Flaming Burger', emoji: '🍔🔥' },
  '🎮+⭐': { name: 'Star Gamer', emoji: '🎮⭐' },
  '🎮+👾': { name: 'Retro Gamer', emoji: '🕹️👾' },
  '🎮+🏆': { name: 'Champion Gamer', emoji: '🎮🏆' },
  '🚀+🔥': { name: 'Rocket Blaze', emoji: '🚀🔥' },
  '🚀+🌙': { name: 'Moon Mission', emoji: '🚀🌙' },
  '🚀+💎': { name: 'Diamond Rocket', emoji: '🚀💎' },
  '💪+💎': { name: 'Diamond Strength', emoji: '💪💎' },
  '💪+👑': { name: 'Power King', emoji: '💪👑' },
  '💪+⭐': { name: 'Star Power', emoji: '💪⭐' },
  '👑+🔥': { name: 'Fire King', emoji: '👑🔥' },
  '👑+✨': { name: 'Sparkling Crown', emoji: '👑✨' },
  '🦋+✨': { name: 'Sparkling Butterfly', emoji: '🦋✨' },
  '🦋+🌙': { name: 'Moon Butterfly', emoji: '🦋🌙' },
  '🌙+✨': { name: 'Moonlit Sparkle', emoji: '🌙✨' },
  '🌙+🔥': { name: 'Moonfire', emoji: '🌙🔥' },
  '🍀+❤️': { name: 'Lucky Love', emoji: '🍀❤️' },
  '🍀+✨': { name: 'Lucky Sparkle', emoji: '🍀✨' },
  '🎂+❤️': { name: 'Birthday Love', emoji: '🎂❤️' },
  '🎂+🔥': { name: 'Lit Birthday', emoji: '🎂🔥' },
  '🎁+❤️': { name: 'Gift of Love', emoji: '🎁❤️' },
  '🎁+✨': { name: 'Sparkling Gift', emoji: '🎁✨' },
  '😀+👻': { name: 'Happy Ghost', emoji: '👻😊' },
  '😂+👻': { name: 'Ghost Laugh', emoji: '😂👻' },
  '🥰+🔥': { name: 'Passionate Love', emoji: '🥰🔥' },
  '😎+💎': { name: 'Diamond Cool', emoji: '😎💎' },
  '🤓+🔥': { name: 'Nerd Blaze', emoji: '🤓🔥' },
  '🥳+🔥': { name: 'Fire Party', emoji: '🥳🔥' },
  '😈+👑': { name: 'Demon King', emoji: '😈👑' },
  '👿+🔥': { name: 'Inferno Demon', emoji: '👿🔥' },
  '👿+👻': { name: 'Dark Spirit', emoji: '👿👻' },
  '🐶+🐰': { name: 'Puppy Bunny', emoji: '🐶🐰' },
  '🐻+🐼': { name: 'Bear Bros', emoji: '🐻🐼' },
  '🐯+🦁': { name: 'Big Cats', emoji: '🐯🦁' },
}

const FALLBACK_NAMES = [
  'Cosmic Fusion', 'Mystery Blend', 'Chaotic Mix', 'Epic Mashup', 'Wild Combo',
  'Quantum Merge', 'Savage Blend', 'Legendary Fusion', 'Ultra Mix', 'Bizarre Mashup',
  'Electric Fusion', 'Neon Mashup', 'Atomic Blend', 'Galaxy Merger', 'Pixel Fusion'
]

function getComboKey(e1, e2) {
  return [e1, e2].sort().join('+')
}

function getMixResult(e1, e2) {
  const key = getComboKey(e1, e2)
  if (COMBOS[key]) return COMBOS[key]
  const hash = (e1.codePointAt(0) + e2.codePointAt(0)) % FALLBACK_NAMES.length
  return { name: FALLBACK_NAMES[hash], emoji: e1 + e2 }
}

export default function EmojiMixer() {
  const [emoji1, setEmoji1] = useState(null)
  const [emoji2, setEmoji2] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMix = useCallback(() => {
    if (!emoji1 || !emoji2) return
    setIsAnimating(true)
    setTimeout(() => {
      const mixResult = getMixResult(emoji1, emoji2)
      setResult({ emoji1, emoji2, ...mixResult })
      setHistory(prev => [{ emoji1, emoji2, ...mixResult, id: Date.now() }, ...prev].slice(0, 5))
      setIsAnimating(false)
    }, 600)
  }, [emoji1, emoji2])

  const handleRandom = useCallback(() => {
    const r1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    let r2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    while (r2 === r1) {
      r2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    }
    setEmoji1(r1)
    setEmoji2(r2)
    setIsAnimating(true)
    setTimeout(() => {
      const mixResult = getMixResult(r1, r2)
      setResult({ emoji1: r1, emoji2: r2, ...mixResult })
      setHistory(prev => [{ emoji1: r1, emoji2: r2, ...mixResult, id: Date.now() }, ...prev].slice(0, 5))
      setIsAnimating(false)
    }, 600)
  }, [])

  const handleClear = useCallback(() => {
    setEmoji1(null)
    setEmoji2(null)
    setResult(null)
  }, [])

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          @keyframes popIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes mixSpin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(0.8); }
            100% { transform: rotate(360deg) scale(1); }
          }
          .emoji-mixer-mix-btn:hover {
            animation: shake 0.4s ease-in-out infinite;
          }
          .emoji-mixer-result-appear {
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          .emoji-mixer-spinning {
            animation: mixSpin 0.6s ease-in-out;
          }
        `}</style>

        <div className="tool-content">
          {/* Picker Area */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)'
          }}>
            {/* Emoji Picker 1 */}
            <div style={{
              flex: '1 1 300px',
              minWidth: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md)',
            }}>
              <div className="form-group">
                <label style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  Pick Emoji 1
                </label>
                <div style={{
                  fontSize: '3rem',
                  textAlign: 'center',
                  padding: 'var(--space-sm) 0',
                  minHeight: '4.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {emoji1 || <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Select an emoji below</span>}
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
                gap: '4px',
                maxHeight: '280px',
                overflowY: 'auto',
                padding: 'var(--space-xs)',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji1(e)}
                    style={{
                      fontSize: '1.4rem',
                      padding: '4px',
                      background: emoji1 === e ? 'var(--accent-glow)' : 'transparent',
                      border: emoji1 === e ? '2px solid var(--accent)' : '2px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '1',
                    }}
                    title={e}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Picker 2 */}
            <div style={{
              flex: '1 1 300px',
              minWidth: 0,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md)',
            }}>
              <div className="form-group">
                <label style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  Pick Emoji 2
                </label>
                <div style={{
                  fontSize: '3rem',
                  textAlign: 'center',
                  padding: 'var(--space-sm) 0',
                  minHeight: '4.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {emoji2 || <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Select an emoji below</span>}
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
                gap: '4px',
                maxHeight: '280px',
                overflowY: 'auto',
                padding: 'var(--space-xs)',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji2(e)}
                    style={{
                      fontSize: '1.4rem',
                      padding: '4px',
                      background: emoji2 === e ? 'var(--accent-glow)' : 'transparent',
                      border: emoji2 === e ? '2px solid var(--accent)' : '2px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '1',
                    }}
                    title={e}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-lg)'
          }}>
            <button
              className="btn btn-primary btn-lg emoji-mixer-mix-btn"
              onClick={handleMix}
              disabled={!emoji1 || !emoji2 || isAnimating}
              style={{
                minWidth: '160px',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              {isAnimating ? '✨ Mixing...' : '🧪 Mix!'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRandom}
              disabled={isAnimating}
            >
              🎲 Random Mix
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClear}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Result */}
          {result && (
            <>
              <div className="divider" />
              <div
                className={isAnimating ? 'emoji-mixer-spinning' : 'emoji-mixer-result-appear'}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-glow), rgba(168,85,247,0.15))',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  border: '1px solid var(--border)',
                  marginBottom: 'var(--space-lg)'
                }}
              >
                <div style={{
                  fontSize: '4rem',
                  marginBottom: 'var(--space-sm)',
                  lineHeight: 1.2,
                }}>
                  {result.emoji}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  {result.emoji1} + {result.emoji2} =
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em'
                }}>
                  {result.name}
                </div>
              </div>
            </>
          )}

          {/* History */}
          {history.length > 0 && (
            <>
              <div className="divider" />
              <div className="form-group">
                <label style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: 'var(--space-sm)',
                  display: 'block'
                }}>
                  Recent Mixes
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  flexWrap: 'wrap'
                }}>
                  {history.map(h => (
                    <div
                      key={h.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-sm) var(--space-md)',
                        textAlign: 'center',
                        minWidth: '110px',
                        flex: '0 0 auto'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '2px' }}>
                        {h.emoji}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        {h.emoji1}+{h.emoji2}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 600
                      }}>
                        {h.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

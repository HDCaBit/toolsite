import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle, faHeart as faHeartSolid, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'caption-generator')

const captionsDb = {
  savage: [
    "I'm not always sarcastic. Sometimes, I'm sleeping.",
    "Throwing shade like it's sunny.",
    "I'd agree with you but then we'd both be wrong.",
    "Proof that I can do selfies better than you.",
    "Too glam to give a damn.",
    "My vibe right now is just living life.",
    "Make them stop and stare.",
    "50% Savage. 50% Sweetness.",
    "I'm everything you want but can't have.",
    "You were my cup of tea, but I drink champagne now.",
    "Catch flights, not feelings.",
    "I’m the reason I smile every day.",
    "Not a secret, just not your business.",
    "I put the 'Pro' in procrastinate.",
    "Sweeter than honey.",
    "I do a thing called 'what I want'.",
    "Find me where the wild things are.",
    "Sunshine mixed with a little hurricane.",
    "I'm not bossy, I just have better ideas.",
    "They told me I couldn't. That's why I did."
  ],
  aesthetic: [
    "Lost in the right direction.",
    "Chasing sunsets and dreams.",
    "Romanticizing my life.",
    "In my own lane, at my own pace.",
    "Less perfection, more authenticity.",
    "Living for the moments I can't put into words.",
    "Create your own sunshine.",
    "Everything you need is already inside you.",
    "Collect moments, not things.",
    "Simplicity is the ultimate sophistication.",
    "Aesthetically pleasing.",
    "Just a vibe.",
    "Focusing on the good.",
    "Finding beauty in the ordinary.",
    "Embracing the glorious mess that I am.",
    "Art is the journey of a free soul.",
    "Escape the ordinary.",
    "Make it simple, but significant.",
    "Vibing and thriving.",
    "Quiet minds hear the loudest."
  ],
  funny: [
    "I need a six month holiday, twice a year.",
    "Reality called, so I hung up.",
    "I put the 'elusive' in influencer.",
    "I followed my heart, it led me to the fridge.",
    "Maybe she's born with it, maybe it's an Instagram filter.",
    "I’m not lazy, I’m just on energy saving mode.",
    "My favorite exercise is a cross between a lunge and a crunch... I call it lunch.",
    "Sure, I do marathons. On Netflix.",
    "I’m not short, I’m concentrated awesome.",
    "There's no 'we' in fries.",
    "If we were on a sinking ship, I’d share my door with you.",
    "I need a room full of puppies.",
    "Just dropped my new single. It's me. I'm single.",
    "I hold the door for people who are far away so they have to run.",
    "Life is short. Smile while you still have teeth.",
    "I’m currently experiencing life at 15 WTFs per hour.",
    "I’m writing a book on reverse psychology. Please don't buy it.",
    "I speak fluent sarcasm.",
    "My bed is a magical place where I suddenly remember everything I forgot to do.",
    "I’m on a seafood diet. I see food and I eat it."
  ],
  motivational: [
    "Don't stop until you're proud.",
    "Dream big, work hard, stay focused.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your only limit is your mind.",
    "Do something today that your future self will thank you for.",
    "Believe you can and you're halfway there.",
    "Success is not final, failure is not fatal.",
    "Hard work beats talent when talent doesn't work hard.",
    "Every day is a second chance.",
    "Turn your wounds into wisdom.",
    "It always seems impossible until it's done.",
    "The secret of getting ahead is getting started.",
    "You didn't come this far to only come this far.",
    "Fall seven times, stand up eight.",
    "Don't wait for opportunity. Create it.",
    "Prove them wrong.",
    "Small steps in the right direction.",
    "Make your vision so clear that your fears become irrelevant.",
    "Be the energy you want to attract.",
    "Keep going."
  ],
  romantic: [
    "You're my favorite notification.",
    "Together is my favorite place to be.",
    "I look at you and see the rest of my life in front of my eyes.",
    "You stole my heart, but I'll let you keep it.",
    "I love you more than pizza.",
    "You're the apple to my pie.",
    "My heart is, and always will be, yours.",
    "Every love story is beautiful, but ours is my favorite.",
    "I never want to stop making memories with you.",
    "You are my today and all of my tomorrows.",
    "I still fall for you every day.",
    "You make my heart smile.",
    "Home is wherever I'm with you.",
    "You're my spark in the dark.",
    "We go together like coffee and donuts.",
    "You're the best thing I never knew I needed.",
    "Love you to the moon and back.",
    "Always better together.",
    "You're my happy place.",
    "P.S. I love you."
  ],
  chill: [
    "Just going with the flow.",
    "Sunday kind of love.",
    "No bad days.",
    "Good vibes only.",
    "Stress less and enjoy the best.",
    "Take it easy.",
    "Breathe in, breathe out.",
    "Chillin' like a villain.",
    "Keep calm and chill on.",
    "Offline is the new luxury.",
    "Living on island time.",
    "Catching some rays.",
    "Peace, love, and good vibes.",
    "Letting the day unfold.",
    "Relax. Refresh. Reconnect.",
    "Current mood: Do Not Disturb.",
    "Slowing down.",
    "Finding my center.",
    "A Sunday well spent brings a week of content.",
    "Unwind."
  ],
  party: [
    "A little party never killed nobody.",
    "Cheers to the weekend.",
    "Time to drink champagne and dance on the table.",
    "Good times + Crazy friends = Great memories.",
    "The night is still young.",
    "Let's get this party started.",
    "Eat, sleep, party, repeat.",
    "Life is a party, dress like it.",
    "We don't remember days, we remember moments.",
    "Here's to the nights we won't remember with the friends we'll never forget.",
    "Dance like no one is watching.",
    "Keep calm and party on.",
    "Pop, fizz, clink.",
    "Making memories we'll never forget.",
    "The best nights are usually unplanned, random and spontaneous.",
    "Bring on the night.",
    "Ready to celebrate.",
    "Sparkle and shine.",
    "Good friends, good drinks, good times.",
    "Let's glow."
  ],
  deep: [
    "We are all broken, that's how the light gets in.",
    "Stars can't shine without darkness.",
    "Not all who wander are lost.",
    "The quieter you become, the more you can hear.",
    "What consumes your mind controls your life.",
    "Sometimes the right path is not the easiest one.",
    "Life is what happens when you're busy making other plans.",
    "In the end, we only regret the chances we didn't take.",
    "And so, the adventure begins.",
    "Every moment matters.",
    "To live will be an awfully big adventure.",
    "Find what you love and let it kill you.",
    "We accept the love we think we deserve.",
    "Whatever you are, be a good one.",
    "The soul always knows what to do to heal itself.",
    "Embrace the glorious mess that you are.",
    "Don't be pushed around by the fears in your mind.",
    "Normality is a paved road: It's comfortable to walk, but no flowers grow on it.",
    "The journey of a thousand miles begins with one step.",
    "It is never too late to be what you might have been."
  ]
}

const moods = [
  { id: 'savage', label: '🔥 Savage' },
  { id: 'aesthetic', label: '💫 Aesthetic' },
  { id: 'funny', label: '😂 Funny' },
  { id: 'motivational', label: '💪 Motivational' },
  { id: 'romantic', label: '❤️ Romantic' },
  { id: 'chill', label: '🌊 Chill' },
  { id: 'party', label: '🎉 Party' },
  { id: 'deep', label: '🤔 Deep' }
]

export default function CaptionGenerator() {
  const [mood, setMood] = useState('aesthetic')
  const [caption, setCaption] = useState('')
  const [favorites, setFavorites] = useState([])
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('caption-favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {}
    }
    shuffleCaption('aesthetic')
  }, [])

  const shuffleCaption = (targetMood = mood) => {
    setAnimate(true)
    setTimeout(() => setAnimate(false), 300)
    
    const list = captionsDb[targetMood]
    let newCap = caption
    while (newCap === caption) {
      newCap = list[Math.floor(Math.random() * list.length)]
    }
    setCaption(newCap)
  }

  const handleMoodChange = (m) => {
    setMood(m)
    shuffleCaption(m)
  }

  const toggleFavorite = (cap) => {
    let newFavs
    if (favorites.includes(cap)) {
      newFavs = favorites.filter(f => f !== cap)
    } else {
      newFavs = [cap, ...favorites].slice(0, 20) // max 20
    }
    setFavorites(newFavs)
    localStorage.setItem('caption-favorites', JSON.stringify(newFavs))
  }

  const isFavorite = favorites.includes(caption)

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          {moods.map(m => (
            <button
              key={m.id}
              className={`btn ${mood === m.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleMoodChange(m.id)}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--accent)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          textAlign: 'center',
          boxShadow: 'var(--accent-glow)',
          position: 'relative',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '600', 
            margin: '0 0 var(--space-lg)',
            transition: 'opacity 0.2s',
            opacity: animate ? 0 : 1
          }}>
            "{caption}"
          </h2>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button className="btn btn-primary" onClick={() => shuffleCaption()}>
              <FontAwesomeIcon icon={faShuffle} />
              Shuffle Next
            </button>
            <CopyButton text={caption} className="btn-secondary" />
            <button 
              className="btn btn-secondary btn-icon"
              onClick={() => toggleFavorite(caption)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} style={{ color: isFavorite ? '#ef4444' : 'inherit' }} />
            </button>
          </div>
        </div>

        {favorites.length > 0 && (
          <>
            <div className="divider" style={{ margin: 'var(--space-xl) 0 var(--space-md)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ margin: 0 }}>Your Favorites ({favorites.length}/20)</h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => { setFavorites([]); localStorage.removeItem('caption-favorites') }}
              >
                <FontAwesomeIcon icon={faTrash} />
                Clear All
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {favorites.map((fav, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border)'
                }}>
                  <span>"{fav}"</span>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <CopyButton text={fav} />
                    <button 
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => toggleFavorite(fav)}
                    >
                      <FontAwesomeIcon icon={faHeartSolid} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ToolLayout>
    </>
  )
}

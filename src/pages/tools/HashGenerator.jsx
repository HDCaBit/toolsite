import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFingerprint, faHashtag } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'hash-generator')

// SHA via Web Crypto
async function sha(algorithm, message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Simple MD5 implementation
function md5(string) {
  function safeAdd(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  function md5blks(s) {
    const nblk = ((s.length + 8) >> 6) + 1
    const blks = new Array(nblk * 16).fill(0)
    for (let i = 0; i < s.length; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8)
    blks[s.length >> 2] |= 0x80 << ((s.length % 4) * 8)
    blks[nblk * 16 - 2] = s.length * 8
    return blks
  }

  const x = md5blks(string)
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878

  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = md5ff(a, b, c, d, x[i], 7, -680876936); d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063); b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5gg(b, c, d, a, x[i], 20, -373897302)
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558); d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5hh(d, a, b, c, x[i], 11, -358537222)
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = md5ii(a, b, c, d, x[i], 6, -198630844); d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd)
  }

  function int32ToHex(val) {
    return [val & 0xFF, (val >> 8) & 0xFF, (val >> 16) & 0xFF, (val >> 24) & 0xFF]
      .map(b => b.toString(16).padStart(2, '0')).join('')
  }

  return int32ToHex(a) + int32ToHex(b) + int32ToHex(c) + int32ToHex(d)
}

const HASH_TYPES = [
  { id: 'md5', label: 'MD5', bits: '128-bit' },
  { id: 'sha1', label: 'SHA-1', bits: '160-bit' },
  { id: 'sha256', label: 'SHA-256', bits: '256-bit' },
  { id: 'sha512', label: 'SHA-512', bits: '512-bit' },
]

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [loading, setLoading] = useState(false)

  const generateHashes = useCallback(async () => {
    if (!input) { setHashes({}); return }
    setLoading(true)
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        sha('SHA-1', input),
        sha('SHA-256', input),
        sha('SHA-512', input),
      ])
      const md5hash = md5(input)
      setHashes({ md5: md5hash, sha1, sha256, sha512 })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [input])

  return (
    <>
      <SEOHead
        title={tool.seoTitle}
        description={tool.seoDescription}
        keywords={tool.keywords}
        path={tool.path}
      />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Input Text</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={5}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={generateHashes}
            disabled={!input || loading}
            style={{ marginBottom: '24px' }}
          >
            <FontAwesomeIcon icon={faFingerprint} />
            {loading ? 'Generating...' : 'Generate All Hashes'}
          </button>

          {Object.keys(hashes).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HASH_TYPES.map(({ id, label, bits }) => (
                <div key={id} className="result-panel">
                  <div className="result-panel-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faHashtag} />
                      {label}
                      <span style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: '100px',
                        fontSize: '0.7rem',
                        padding: '1px 8px',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}>{bits}</span>
                    </span>
                    <CopyButton text={hashes[id] || ''} />
                  </div>
                  <div className="result-panel-body" style={{ fontSize: '0.8rem', lineHeight: 1.5, wordBreak: 'break-all' }}>
                    {hashes[id]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

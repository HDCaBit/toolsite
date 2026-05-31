import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faParagraph, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'lorem-ipsum')

const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus.",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur omnis dolor repellendus.",
  "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus omnis voluptas assumenda est omnis dolor repellendus.",
  "Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat et harum quidem rerum facilis est.",
]

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident culpa officia deserunt mollit anim est laborum".split(' ')

function generateWords(count) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(LOREM_WORDS[i % LOREM_WORDS.length])
  }
  return result.join(' ')
}

function generateSentences(count) {
  const sentences = LOREM_PARAGRAPHS.flatMap(p => p.split('. ').map(s => s.trim() + '.'))
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(sentences[i % sentences.length])
  }
  return result.join(' ')
}

function generateParagraphs(count, startWithLorem) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length])
  }
  if (startWithLorem && result.length > 0) {
    result[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result[0]
  }
  return result.join('\n\n')
}

export default function LoremIpsum() {
  const [type, setType] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')

  const generate = useCallback(() => {
    let result = ''
    if (type === 'paragraphs') result = generateParagraphs(count, startWithLorem)
    else if (type === 'sentences') result = generateSentences(count)
    else result = generateWords(count)
    setOutput(result)
  }, [type, count, startWithLorem])

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
          <div className="row" style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faParagraph} style={{ marginRight: 8, color: 'var(--accent-light)' }} />
                Type
              </label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="form-group">
              <label>Count: <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{count}</span></label>
              <input
                type="range"
                min={1}
                max={20}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>1</span><span>20</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="start-lorem"
              checked={startWithLorem}
              onChange={e => setStartWithLorem(e.target.checked)}
              style={{ width: 18, height: 18 }}
              disabled={type !== 'paragraphs'}
            />
            <label htmlFor="start-lorem" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Start with "Lorem ipsum…"
            </label>
          </div>

          <button className="btn btn-primary btn-lg" onClick={generate} style={{ marginBottom: 24, width: '100%' }}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Generate Lorem Ipsum
          </button>

          {output && (
            <div className="result-panel">
              <div className="result-panel-header">
                <span>{count} {type}</span>
                <CopyButton text={output} />
              </div>
              <div className="result-panel-body" style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: 500 }}>
                {output}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

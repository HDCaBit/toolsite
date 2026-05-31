import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont, faDeleteLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'text-case')

function toTitleCase(str) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

function toSentenceCase(str) {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase())
}

function toPascalCase(str) {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s\-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .replace(/__+/g, '_')
    .toLowerCase()
    .replace(/^_|_$/g, '')
}

function toKebabCase(str) {
  return toSnakeCase(str).replace(/_/g, '-')
}

const cases = [
  { label: 'UPPERCASE', fn: s => s.toUpperCase(), desc: 'ALL CAPS' },
  { label: 'lowercase', fn: s => s.toLowerCase(), desc: 'all lower' },
  { label: 'Title Case', fn: toTitleCase, desc: 'Each Word' },
  { label: 'Sentence case', fn: toSentenceCase, desc: 'First word' },
  { label: 'camelCase', fn: toCamelCase, desc: 'camelCase' },
  { label: 'PascalCase', fn: toPascalCase, desc: 'PascalCase' },
  { label: 'snake_case', fn: toSnakeCase, desc: 'snake_case' },
  { label: 'kebab-case', fn: toKebabCase, desc: 'kebab-case' },
]

export default function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeCase, setActiveCase] = useState(null)

  const convert = useCallback((caseItem) => {
    setOutput(caseItem.fn(input))
    setActiveCase(caseItem.label)
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
          <div className="form-group" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>
                <FontAwesomeIcon icon={faFont} style={{ marginRight: 8, color: 'var(--accent-light)' }} />
                Input Text
              </label>
              {input && (
                <button className="btn btn-secondary btn-sm" onClick={() => { setInput(''); setOutput(''); setActiveCase(null) }}>
                  <FontAwesomeIcon icon={faDeleteLeft} /> Clear
                </button>
              )}
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type or paste your text here…"
              style={{ minHeight: 160, fontFamily: 'var(--font-sans)' }}
            />
          </div>

          {/* Case Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {cases.map(c => (
              <button
                key={c.label}
                className={`btn btn-sm ${activeCase === c.label ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => convert(c)}
                disabled={!input.trim()}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Output */}
          {output && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <FontAwesomeIcon icon={faArrowDown} />
                Result — <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{activeCase}</span>
              </div>
              <div className="result-panel">
                <div className="result-panel-header">
                  <span>Output</span>
                  <CopyButton text={output} />
                </div>
                <div className="result-panel-body" style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {output}
                </div>
              </div>
            </>
          )}
        </div>
      </ToolLayout>
    </>
  )
}

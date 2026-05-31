import { useState, useEffect } from 'react'
import SEOHead from '../../components/SEO/SEOHead'
import ToolLayout, { CopyButton } from '../../components/ToolLayout'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'markdown-preview')

const SAMPLE = `# Welcome to Markdown Preview

A **live** Markdown editor with *real-time* preview.

## Features
- Real-time preview
- GitHub Flavored Markdown
- Code syntax highlighting
- Tables support

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Name | Type | Description |
|------|------|-------------|
| id | number | Unique identifier |
| name | string | Display name |
| active | boolean | Status |

> **Note:** All Markdown is rendered instantly as you type.

[Visit Tools.101142.xyz](https://tools.101142.xyz)
`

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [html, setHtml] = useState('')

  useEffect(() => {
    import('marked').then(({ marked }) => {
      marked.setOptions({ breaks: true, gfm: true })
      setHtml(marked.parse(markdown))
    })
  }, [markdown])

  return (
    <>
      <SEOHead title={tool.seoTitle} description={tool.seoDescription} keywords={tool.keywords} path={tool.path} />
      <ToolLayout tool={tool}>
        <div className="tool-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge">Write</span>
              <span className="badge">↔</span>
              <span className="badge">Preview</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setMarkdown(SAMPLE)}>Reset to sample</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setMarkdown('')}>Clear</button>
              <CopyButton text={markdown} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: 500 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Markdown</div>
              <textarea
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                style={{ flex: 1, minHeight: 480, resize: 'none' }}
                placeholder="Type your Markdown here..."
                spellCheck={false}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview</div>
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '1rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  minHeight: 480,
                }}
              />
            </div>
          </div>
          <style>{`
            .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { color: var(--text-primary); margin: 1rem 0 0.5rem; }
            .markdown-body h1 { font-size: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
            .markdown-body h2 { font-size: 1.2rem; }
            .markdown-body p { margin: 0.75rem 0; }
            .markdown-body code { background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; color: var(--accent-light); }
            .markdown-body pre { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 0.75rem 0; }
            .markdown-body pre code { background: none; padding: 0; color: var(--text-primary); }
            .markdown-body ul, .markdown-body ol { padding-left: 1.5rem; margin: 0.5rem 0; }
            .markdown-body li { margin: 0.25rem 0; }
            .markdown-body blockquote { border-left: 3px solid var(--accent); margin: 0.75rem 0; padding: 0.5rem 1rem; background: var(--bg-secondary); border-radius: 0 8px 8px 0; color: var(--text-secondary); }
            .markdown-body table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
            .markdown-body th, .markdown-body td { border: 1px solid var(--border); padding: 6px 12px; text-align: left; }
            .markdown-body th { background: var(--bg-secondary); font-weight: 600; }
            .markdown-body a { color: var(--accent-light); }
            .markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
            @media (max-width: 640px) { .markdown-body-wrap { flex-direction: column; } }
          `}</style>
        </div>
      </ToolLayout>
    </>
  )
}

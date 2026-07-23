import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import './Pages.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const REQUEST_BODY = `{
  "query": "what is artificial intelligence",
  "max_results": 5,
  "include_answer": true
}`

const RESPONSE_BODY = `{
  "query": "what is artificial intelligence",
  "answer": "Artificial intelligence is ...",
  "results": [
    {
      "title": "Artificial intelligence - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/...",
      "content": "AI is the capability of ...",
      "score": 0.98
    }
  ],
  "response_time": 1.24
}`

const CURL = `curl -X POST ${API_BASE}/api/search \\
  -H "Content-Type: application/json" \\
  -d '{"query":"artificial intelligence","max_results":5}'`

const PARAMS = [
  { name: 'query', type: 'string', required: true, desc: 'The search term. Required, must be non-empty.' },
  { name: 'max_results', type: 'integer', required: false, desc: 'How many results to return. Defaults to 5.' },
  { name: 'include_answer', type: 'boolean', required: false, desc: 'Whether to generate an AI summary. Defaults to true.' },
]

const CodeBlock = ({ code, label }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-label">{label}</span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

const Docs = () => {
  const { isDark } = useTheme()

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Documentation</h1>
          <p className="page-subtitle">How to use the SkillHub Search API</p>
        </div>
      </motion.div>

      <div className="legal-container">
        <motion.section
          className="legal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Getting started</h2>
          <p className="legal-intro">
            The frontend talks to a single endpoint. Point it at your backend by setting{' '}
            <code className="inline-code">VITE_API_URL</code> in a{' '}
            <code className="inline-code">.env</code> file at the project root.
          </p>
          <CodeBlock label=".env" code={'VITE_API_URL=http://localhost:8001\nVITE_USE_MOCK=true'} />
          <p className="legal-note">
            While <code className="inline-code">VITE_USE_MOCK</code> is <code className="inline-code">true</code>,
            an unreachable backend falls back to placeholder results instead of throwing, so the UI
            stays usable. Set it to <code className="inline-code">false</code> to surface real errors.
          </p>
        </motion.section>

        <motion.section
          className="legal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h2>Endpoint</h2>
          <div className="endpoint">
            <span className="endpoint-method">POST</span>
            <code className="endpoint-path">{API_BASE}/api/search</code>
          </div>

          <h3 className="legal-subhead">Request parameters</h3>
          <div className="params-table">
            {PARAMS.map((param) => (
              <div className="param-row" key={param.name}>
                <div className="param-name">
                  <code className="inline-code">{param.name}</code>
                  {param.required && <span className="param-required">required</span>}
                </div>
                <span className="param-type">{param.type}</span>
                <span className="param-desc">{param.desc}</span>
              </div>
            ))}
          </div>

          <CodeBlock label="Request body" code={REQUEST_BODY} />
          <CodeBlock label="Response 200" code={RESPONSE_BODY} />
        </motion.section>

        <motion.section
          className="legal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <h2>Example</h2>
          <CodeBlock label="cURL" code={CURL} />
        </motion.section>

        <motion.section
          className="legal-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <h2>Errors</h2>
          <ul>
            <li>
              <code className="inline-code">400</code> — the query was missing or empty.
            </li>
            <li>
              <code className="inline-code">429</code> — rate limit exceeded; back off and retry.
            </li>
            <li>
              <code className="inline-code">500</code> — the search provider or AI service failed.
            </li>
          </ul>
          <p className="legal-note">
            Error bodies return a <code className="inline-code">detail</code> field, which the
            frontend surfaces directly in a toast.
          </p>
        </motion.section>
      </div>
    </div>
  )
}

export default Docs

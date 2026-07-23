import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './AISummary.css'

const AISummary = ({ answer, query, responseTime }) => {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()

  const handleCopy = () => {
    navigator.clipboard.writeText(answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className={`ai-summary ${isDark ? 'dark' : 'light'}`}
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="ai-summary-header">
        <div className="ai-summary-icon" aria-hidden="true">✨</div>
        <div className="ai-summary-heading">
          <h2 className="ai-summary-title">AI Summary</h2>
          {query && <p className="ai-summary-query">for “{query}”</p>}
        </div>

        <button
          type="button"
          className="ai-summary-copy"
          onClick={handleCopy}
          aria-label="Copy AI summary to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="ai-summary-body">
        <p>{answer}</p>
      </div>

      {responseTime != null && (
        <div className="ai-summary-footer">
          <span className="ai-summary-meta">
            Generated in {Number(responseTime).toFixed(2)}s
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default AISummary

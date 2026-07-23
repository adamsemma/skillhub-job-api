import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './ResultCard.css'

const ResultCard = ({ result, index }) => {
  const [expanded, setExpanded] = useState(false)
  const { isDark } = useTheme()

  const truncateContent = (content, maxLength = 250) => {
    if (!content) return 'No content available'
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <motion.div 
      className={`result-card ${isDark ? 'dark' : 'light'}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="result-header">
        <span className="result-index">#{index + 1}</span>
        <h3 className="result-title">
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            {result.title || 'Untitled'}
          </a>
        </h3>
        <a 
          href={result.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="domain-link"
        >
          {getDomain(result.url)}
        </a>
      </div>
      
      <p className="result-content">
        {expanded ? result.content : truncateContent(result.content)}
      </p>
      
      {result.content && result.content.length > 250 && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="expand-button"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      
      <div className="result-footer">
        {result.published_date && (
          <span className="meta-item">
            📅 {new Date(result.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )}
        {result.score && (
          <span className="meta-item">
            ⭐ {(result.score * 100).toFixed(0)}% relevance
          </span>
        )}
        <span className="meta-item">
          🔗 {getDomain(result.url)}
        </span>
      </div>
    </motion.div>
  )
}

export default ResultCard
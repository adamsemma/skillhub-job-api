import React from 'react'
import { motion } from 'framer-motion'
import ResultCard from './ResultCard'
import { useTheme } from '../../context/ThemeContext'
import './ResultsList.css'

const ResultsList = ({ results, query }) => {
  const { isDark } = useTheme()

  if (!results || results.length === 0) {
    return (
      <div className={`no-results ${isDark ? 'dark' : 'light'}`}>
        <span className="no-results-icon">🔍</span>
        <h3>No results found</h3>
        <p>Try adjusting your search query or filters</p>
      </div>
    )
  }

  return (
    <div className={`results-list ${isDark ? 'dark' : 'light'}`}>
      <div className="results-header">
        <h2>
          <span className="results-count-badge">{results.length}</span>
          Results for &quot;{query}&quot;
        </h2>
        <span className="results-info">
          {results.length} results found
        </span>
      </div>

      <div className="results-grid">
        {results.map((result, index) => (
          <motion.div
            key={`${result.url}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ResultCard result={result} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ResultsList

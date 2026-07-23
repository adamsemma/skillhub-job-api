import React from 'react'
import { motion } from 'framer-motion'
import { FaHistory, FaTimes } from '../common/Icons'
import { useTheme } from '../../context/ThemeContext'
import './SearchHistory.css'

const SearchHistory = ({ history = [], onSelect, onRemove, limit = 5 }) => {
  const { isDark } = useTheme()

  if (!history.length) return null

  return (
    <motion.div
      className={`search-history ${isDark ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="search-history-label">
        <FaHistory /> Recent
      </span>

      <div className="search-history-chips">
        {history.slice(0, limit).map((item) => (
          <span key={item.query} className="search-history-chip">
            <button
              type="button"
              className="chip-text"
              onClick={() => onSelect && onSelect(item.query)}
            >
              {item.query}
            </button>
            {onRemove && (
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove ${item.query}`}
                onClick={() => onRemove(item.query)}
              >
                <FaTimes />
              </button>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default SearchHistory

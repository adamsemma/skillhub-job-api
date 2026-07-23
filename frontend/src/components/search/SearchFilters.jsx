import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './SearchFilters.css'

const SearchFilters = ({ filters, setFilters }) => {
  const { isDark } = useTheme()

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div 
      className={`filters ${isDark ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="filters-container">
        <label className="filter-item">
          <span className="filter-label">Results</span>
          <select
            value={filters.maxResults}
            onChange={(e) => handleChange('maxResults', Number(e.target.value))}
            className="filter-select"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <label className="filter-item">
          <span className="filter-label">AI Summary</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={filters.includeAnswer}
              onChange={(e) => handleChange('includeAnswer', e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
          </div>
        </label>
      </div>
    </motion.div>
  )
}

export default SearchFilters
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './SearchBar.css'

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { isDark } = useTheme()
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <motion.div 
      className={`search-bar ${isDark ? 'dark' : 'light'} ${isFocused ? 'focused' : ''}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search anything... (e.g., What is artificial intelligence?)"
            className="search-input"
            disabled={loading}
          />
          <motion.button
            type="submit"
            className="search-submit"
            disabled={loading || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default SearchBar
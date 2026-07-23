import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaSearch, FaArrowRight } from '../common/Icons'
import { useTheme } from '../../context/ThemeContext'
import './RecentSearches.css'

const RecentSearches = ({ limit = 6 }) => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      setItems(history.slice(0, limit))
    } catch {
      setItems([])
    }
  }, [limit])

  if (!items.length) {
    return <div className="recent-empty">No searches yet</div>
  }

  return (
    <div className={`recent-searches ${isDark ? 'dark' : 'light'}`}>
      {items.map((item, index) => (
        <motion.div
          key={`${item.query}-${item.timestamp}`}
          className="recent-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <span className="recent-icon">
            <FaSearch />
          </span>
          <div className="recent-details">
            <span className="recent-query">{item.query}</span>
            <span className="recent-count">{item.results} results</span>
          </div>
        </motion.div>
      ))}

      <button className="recent-view-all" onClick={() => navigate('/history')}>
        View all history <FaArrowRight />
      </button>
    </div>
  )
}

export default RecentSearches

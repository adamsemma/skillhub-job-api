import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrash, FaSearch, FaClock, FaFilter } from '../components/common/Icons'
import { useTheme } from '../context/ThemeContext'
import './Pages.css'

const History = () => {
  const { isDark } = useTheme()
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
    } catch {
      setHistory([])
    }
  }, [])

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      localStorage.removeItem('searchHistory')
      setHistory([])
    }
  }

  const removeItem = (query) => {
    const updated = history.filter((h) => h.query !== query)
    setHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const filteredHistory =
    filter === 'all' ? history : history.filter((h) => h.results > 0)

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Search History</h1>
          <p className="page-subtitle">View and manage your past searches</p>
        </div>
        <div className="page-actions">
          {history.length > 0 && (
            <>
              <button
                className={`action-btn ${filter === 'all' ? 'primary' : ''}`}
                onClick={() => setFilter('all')}
              >
                <FaFilter /> All
              </button>
              <button
                className={`action-btn ${filter === 'results' ? 'primary' : ''}`}
                onClick={() => setFilter('results')}
              >
                <FaFilter /> With Results
              </button>
              <button className="action-btn danger" onClick={clearHistory}>
                <FaTrash /> Clear All
              </button>
            </>
          )}
        </div>
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="empty-icon">🔍</span>
          <h2>No search history yet</h2>
          <p>Start searching to see your history here</p>
        </motion.div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={`${item.query}-${item.timestamp}`}
              className="history-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="history-item-content">
                <div className="history-icon-wrapper">
                  <FaSearch className="history-icon" />
                </div>
                <div className="history-details">
                  <span className="history-query">{item.query}</span>
                  <div className="history-meta">
                    <span className="history-time">
                      <FaClock /> {formatDate(item.timestamp)}
                    </span>
                    <span className="history-results">{item.results} results</span>
                  </div>
                </div>
                <button className="history-remove" onClick={() => removeItem(item.query)}>
                  ×
                </button>
              </div>
            </motion.div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="empty-filter">
              <p>No items match your filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default History

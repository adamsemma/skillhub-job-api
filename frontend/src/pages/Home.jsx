import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import SearchBar from '../components/search/SearchBar'
import SearchFilters from '../components/search/SearchFilters'
import ResultsList from '../components/results/ResultsList'
import AISummary from '../components/ai/AISummary'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import { useSearch } from '../hooks/useSearch'
import './Pages.css'

const TRENDING = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
]

const Home = () => {
  const { isDark } = useTheme()
  const [filters, setFilters] = useState({
    maxResults: 5,
    includeAnswer: true,
    searchType: 'web',
  })

  const { loading, results, search } = useSearch(filters)

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-badge"
          >
            <span className="badge-icon">✨</span>
            AI-Powered Search Engine
          </motion.div>

          <h1 className="hero-title">
            Search the Web with
            <span className="gradient-text"> Artificial Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            Extract, analyze, and understand web content using cutting-edge AI technology
          </p>
        </div>

        <SearchBar onSearch={search} loading={loading} />
        <SearchFilters filters={filters} setFilters={setFilters} />

        {!results && !loading && (
          <motion.div
            className="trending-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="trending-label">🔥 Trending Searches</p>
            <div className="trending-tags">
              {TRENDING.map((item, index) => (
                <motion.button
                  key={item}
                  className="trending-tag"
                  onClick={() => search(item)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>{loading && <LoadingSkeleton />}</AnimatePresence>

      <AnimatePresence>
        {results && !loading && (
          <motion.div
            className="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {results.answer && (
              <AISummary
                answer={results.answer}
                query={results.query}
                responseTime={results.response_time}
              />
            )}
            <ResultsList results={results.results} query={results.query} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home

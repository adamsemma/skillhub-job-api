import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './LoadingSkeleton.css'

const LoadingSkeleton = () => {
  const { isDark } = useTheme()

  return (
    <motion.div 
      className={`skeleton-container ${isDark ? 'dark' : 'light'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* AI Summary Skeleton */}
      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-icon"></div>
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-body">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>

      {/* Results Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-result">
          <div className="skeleton-result-header">
            <div className="skeleton-result-title"></div>
            <div className="skeleton-result-url"></div>
          </div>
          <div className="skeleton-result-body">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
          <div className="skeleton-result-footer">
            <div className="skeleton-meta"></div>
            <div className="skeleton-meta"></div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default LoadingSkeleton
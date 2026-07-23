import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './StatsCard.css'

const StatsCard = ({ icon, title, value, change, color = '#667eea' }) => {
  const { isDark } = useTheme()
  const isNegative = typeof change === 'string' && change.trim().startsWith('-')

  return (
    <motion.div
      className={`stats-card ${isDark ? 'dark' : 'light'}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="stats-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </div>

      <div className="stats-body">
        <span className="stats-title">{title}</span>
        <span className="stats-value">{value}</span>
      </div>

      {change && (
        <span className={`stats-change ${isNegative ? 'down' : 'up'}`}>{change}</span>
      )}
    </motion.div>
  )
}

export default StatsCard

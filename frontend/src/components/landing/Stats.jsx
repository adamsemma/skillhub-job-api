import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './LandingComponents.css'

const Stats = () => {
  const { isDark } = useTheme()

  const stats = [
    { number: '300M+', label: 'API Calls', suffix: '' },
    { number: '99.99%', label: 'Uptime', suffix: '' },
    { number: '180', label: 'Avg Response', suffix: 'ms' },
    { number: '2M+', label: 'Developers', suffix: '' }
  ]

  return (
    <section className={`stats-section ${isDark ? 'dark' : 'light'}`}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="stat-number">
              {stat.number}
              {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Stats
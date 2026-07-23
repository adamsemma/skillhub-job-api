import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaGlobe, FaClock, FaChartLine } from '../components/common/Icons'
import { useTheme } from '../context/ThemeContext'
import StatsCard from '../components/dashboard/StatsCard'
import AnalyticsChart from '../components/dashboard/AnalyticsChart'
import RecentSearches from '../components/dashboard/RecentSearches'
import './Pages.css'

const Dashboard = () => {
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    totalSearches: 0,
    uniqueSearches: 0,
    avgResponseTime: 0,
    successRate: 0,
  })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    let history = []
    try {
      history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    } catch {
      history = []
    }

    const unique = new Set(history.map((h) => h.query))

    setStats({
      totalSearches: history.length,
      uniqueSearches: unique.size,
      avgResponseTime: 1.2,
      successRate: 98.5,
    })

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        searches: Math.floor(Math.random() * 20) + 5,
        success: Math.floor(Math.random() * 15) + 3,
      }
    }).reverse()

    setChartData(last7Days)
  }, [])

  const statsCards = [
    { icon: <FaSearch />, title: 'Total Searches', value: stats.totalSearches, change: '+12%', color: '#667eea' },
    { icon: <FaGlobe />, title: 'Unique Queries', value: stats.uniqueSearches, change: '+8%', color: '#48bb78' },
    { icon: <FaClock />, title: 'Avg Response', value: `${stats.avgResponseTime}s`, change: '-0.3s', color: '#ed8936' },
    { icon: <FaChartLine />, title: 'Success Rate', value: `${stats.successRate}%`, change: '+2.5%', color: '#fc8181' },
  ]

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your search analytics and performance</p>
        </div>
        <div className="page-actions">
          <span className="date-range">Last 7 days</span>
        </div>
      </motion.div>

      <div className="dashboard-stats">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="section-title">Search Activity</h3>
          <AnalyticsChart data={chartData} />
        </motion.div>

        <motion.div
          className="recent-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="section-title">Recent Searches</h3>
          <RecentSearches />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

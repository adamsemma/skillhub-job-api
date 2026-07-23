import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendar, FaDownload } from '../components/common/Icons'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { chartPalette } from '../styles/theme'
import './Pages.css'

const METRICS = [
  { label: 'Total Queries', value: '1,284', change: '+15.3%', trend: 'up' },
  { label: 'Unique Users', value: '342', change: '+8.7%', trend: 'up' },
  { label: 'Click-Through Rate', value: '23.6%', change: '+2.1%', trend: 'up' },
  { label: 'Bounce Rate', value: '18.2%', change: '-4.3%', trend: 'down' },
  { label: 'Avg Session', value: '4m 32s', change: '+12.5%', trend: 'up' },
  { label: 'API Calls', value: '2,847', change: '+22.1%', trend: 'up' },
]

const VOLUME = [
  { name: 'Mon', queries: 42 },
  { name: 'Tue', queries: 58 },
  { name: 'Wed', queries: 71 },
  { name: 'Thu', queries: 49 },
  { name: 'Fri', queries: 86 },
  { name: 'Sat', queries: 33 },
  { name: 'Sun', queries: 27 },
]

const TYPES = [
  { name: 'Web', value: 58 },
  { name: 'News', value: 21 },
  { name: 'Academic', value: 13 },
  { name: 'Images', value: 8 },
]

const Analytics = () => {
  const { isDark } = useTheme()
  const [timeRange, setTimeRange] = useState('7d')
  const [granularity, setGranularity] = useState('Daily')

  const axisColor = isDark ? '#a0aec0' : '#4a5568'
  const gridColor = isDark ? '#2d3748' : '#e2e8f0'

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Detailed insights into your search performance</p>
        </div>
        <div className="page-actions">
          <button
            className="action-btn"
            onClick={() => setTimeRange(timeRange === '7d' ? '30d' : '7d')}
          >
            <FaCalendar /> {timeRange}
          </button>
          <button className="action-btn primary">
            <FaDownload /> Export
          </button>
        </div>
      </motion.div>

      <div className="analytics-grid">
        {METRICS.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="metric-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="metric-label">{metric.label}</span>
            <span className="metric-value">{metric.value}</span>
            <span className={`metric-change ${metric.trend}`}>{metric.change}</span>
          </motion.div>
        ))}
      </div>

      <div className="analytics-charts">
        <motion.div
          className="chart-card large"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <h3>Search Volume Over Time</h3>
            <div className="chart-controls">
              {['Daily', 'Weekly', 'Monthly'].map((g) => (
                <button
                  key={g}
                  className={`chart-btn ${granularity === g ? 'active' : ''}`}
                  onClick={() => setGranularity(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={VOLUME}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1a202c' : '#fff',
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#667eea"
                strokeWidth={2}
                fill="url(#volumeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Search Types</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={TYPES}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {TYPES.map((entry, index) => (
                  <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1a202c' : '#fff',
                  border: `1px solid ${gridColor}`,
                  borderRadius: 8,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import './AnalyticsChart.css'

const AnalyticsChart = ({ data = [] }) => {
  const { isDark } = useTheme()

  const axisColor = isDark ? '#a0aec0' : '#4a5568'
  const gridColor = isDark ? '#2d3748' : '#e2e8f0'

  if (!data.length) {
    return <div className="chart-empty">No activity data yet</div>
  }

  return (
    <div className="analytics-chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(102, 126, 234, 0.08)' }}
            contentStyle={{
              background: isDark ? '#1a202c' : '#fff',
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
              color: isDark ? '#e2e8f0' : '#1a202c',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="searches" name="Searches" fill="#667eea" radius={[6, 6, 0, 0]} />
          <Bar dataKey="success" name="Successful" fill="#48bb78" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalyticsChart

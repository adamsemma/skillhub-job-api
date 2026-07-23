import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaThLarge, FaChartBar, FaHistory, FaCog } from './Icons'
import { useTheme } from '../../context/ThemeContext'
import './Sidebar.css'

const LINKS = [
  { to: '/search', label: 'Search', icon: <FaHome />, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
  { to: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
  { to: '/history', label: 'History', icon: <FaHistory /> },
  { to: '/settings', label: 'Settings', icon: <FaCog /> },
]

const Sidebar = () => {
  const { isDark } = useTheme()

  return (
    <motion.aside
      className={`sidebar ${isDark ? 'dark' : 'light'}`}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <nav className="sidebar-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span>API Connected</span>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
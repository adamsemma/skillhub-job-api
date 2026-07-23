import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      {isDark ? '☀️' : '🌙'}
    </motion.button>
  )
}

export default ThemeToggle
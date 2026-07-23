import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './Footer.css'

const Footer = () => {
  const { isDark } = useTheme()
  const year = new Date().getFullYear()

  return (
    <motion.footer 
      className={`footer ${isDark ? 'dark' : 'light'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-icon">🔍</span>
            <span>SkillHub Search</span>
          </div>
          <p className="footer-text">
            AI-powered web search and content extraction
          </p>
        </div>
        <div className="footer-bottom">
          <p>© {year} SkillHub. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/docs">Docs</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

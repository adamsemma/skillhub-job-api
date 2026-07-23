import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const Navbar = () => {
  const { isDark } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <motion.nav 
      className={`navbar ${isDark ? 'dark' : 'light'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">SkillHub</span>
          <span className="brand-badge">AI</span>
        </Link>
        
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-session">
              <span className="navbar-user">{user?.name || user?.email}</span>
              <button className="navbar-auth-btn" type="button" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <Link className="navbar-auth-btn" to="/login">
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
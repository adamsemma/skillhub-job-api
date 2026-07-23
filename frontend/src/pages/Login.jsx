import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Login.css'

const Login = () => {
  const { isDark } = useTheme()
  const { isAuthenticated, login, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const from = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login(form)
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Unable to sign in')
    }
  }

  return (
    <div className={`login-page ${isDark ? 'dark' : 'light'}`}>
      <motion.section
        className="login-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="login-header">
          <span className="login-brand-icon">🔍</span>
          <div>
            <h1>Sign in to SkillHub</h1>
            <p>Access your dashboard, search history, analytics, and settings.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="current-password"
              minLength={6}
              required
            />
          </label>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-note">
          Backend auth is not present yet, so local demo login accepts any valid email and a password with at least 6 characters.
        </p>
      </motion.section>
    </div>
  )
}

export default Login

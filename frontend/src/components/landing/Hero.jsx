import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import './LandingComponents.css'

const Hero = () => {
  const { isDark } = useTheme()

  return (
    <section className={`hero-section ${isDark ? 'dark' : 'light'}`}>
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="badge-dot">●</span>
            Trusted by 10,000+ developers
          </motion.div>

          <h1 className="hero-title">
            Connect Your AI Agents
            <span className="gradient-text"> to the Web</span>
          </h1>

          <p className="hero-description">
            One secure API for real-time web access. Ground your models with fresh 
            web context and let your agents reason over facts without hallucinating.
          </p>

          <div className="hero-actions">
            <Link to="/search" className="btn-primary">
              Get Started Free
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>

          <div className="hero-stats-mini">
            <div className="stat-mini">
              <span className="stat-number">300M+</span>
              <span className="stat-label">API Calls</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-mini">
              <span className="stat-number">99.99%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-mini">
              <span className="stat-number">180ms</span>
              <span className="stat-label">Avg Response</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="visual-container">
            <div className="code-block">
              <div className="code-header">
                <span className="code-dot red"></span>
                <span className="code-dot yellow"></span>
                <span className="code-dot green"></span>
                <span className="code-title">api.js</span>
              </div>
              <div className="code-body">
                <pre>
                  <code>
                    <span className="code-keyword">import</span> <span className="code-string">&apos;@tavily/api&apos;</span>
                    <br/>
                    <br/>
                    <span className="code-keyword">const</span> <span className="code-var">client</span> = <span className="code-keyword">new</span> <span className="code-class">TavilyClient</span>({'{'})
                    <br/>
                    &nbsp;&nbsp;<span className="code-key">apiKey</span>: <span className="code-string">&apos;tvly-...&apos;</span>
                    <br/>
                    {'}'})
                    <br/>
                    <br/>
                    <span className="code-keyword">const</span> <span className="code-var">results</span> = <span className="code-keyword">await</span> <span className="code-var">client</span>.<span className="code-method">search</span>({'{'})
                    <br/>
                    &nbsp;&nbsp;<span className="code-key">query</span>: <span className="code-string">&apos;AI agents&apos;</span>,
                    <br/>
                    &nbsp;&nbsp;<span className="code-key">max_results</span>: <span className="code-number">5</span>
                    <br/>
                    {'}'})
                  </code>
                </pre>
              </div>
            </div>
            
            <div className="floating-icons">
              <motion.div 
                className="float-icon"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🤖
              </motion.div>
              <motion.div 
                className="float-icon"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                ⚡
              </motion.div>
              <motion.div 
                className="float-icon"
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              >
                🚀
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

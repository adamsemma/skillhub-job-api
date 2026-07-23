import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import './LandingComponents.css'

const CTA = () => {
  const { isDark } = useTheme()

  return (
    <section className={`cta-section ${isDark ? 'dark' : 'light'}`}>
      <div className="cta-container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="cta-badge">Get Started</span>
          <h2>Ready to Build Something Amazing?</h2>
          <p>
            Join thousands of developers already using SkillHub to power their 
            AI agents with real-time web data.
          </p>
          <div className="cta-actions">
            <Link to="/login" className="cta-primary">
              Start Building for Free
              <span className="cta-arrow">→</span>
            </Link>
            <a href="#features" className="cta-secondary">
              View Documentation
            </a>
          </div>
          <div className="cta-trust">
            <span className="trust-badge">✓ No credit card required</span>
            <span className="trust-badge">✓ Free tier included</span>
            <span className="trust-badge">✓ 24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
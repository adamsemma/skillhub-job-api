import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FaSearch, FaCode, FaCheckCircle } from '../common/Icons'
import './LandingComponents.css'

const HowItWorks = () => {
  const { isDark } = useTheme()

  const steps = [
    {
      icon: <FaSearch />,
      number: '01',
      title: 'Search the Web',
      description: 'Send a query to our API and we search the web for relevant content in real-time.'
    },
    {
      icon: <FaCode />,
      number: '02',
      title: 'Extract & Structure',
      description: 'Content is extracted, cleaned, and structured for your AI agents with minimal effort.'
    },
    {
      icon: <FaCheckCircle />,
      number: '03',
      title: 'Get AI-Ready Results',
      description: 'Receive optimized, chunked content ready for RAG applications and AI reasoning.'
    }
  ]

  return (
    <section className={`how-section ${isDark ? 'dark' : 'light'}`}>
      <div className="how-container">
        <motion.div 
          className="how-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="how-badge">How It Works</span>
          <h2>Three Simple Steps to AI-Powered Search</h2>
        </motion.div>

        <div className="how-steps">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="how-step"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                  <span className="connector-arrow">↓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
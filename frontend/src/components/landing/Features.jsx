import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { 
  FaShieldAlt, 
  FaRocket, 
  FaBrain, 
  FaPlug,
  FaLock,
  FaGlobe
} from '../common/Icons'
import './LandingComponents.css'

const Features = () => {
  const { isDark } = useTheme()

  const features = [
    {
      icon: <FaBrain />,
      title: 'AI-Optimized Results',
      description: 'Retrieve live web data and return it structured for models, so agents reason without hallucinating.'
    },
    {
      icon: <FaRocket />,
      title: 'Blazing Fast',
      description: 'Handle thousands of web queries in seconds with intelligent caching and low-latency responses.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Built-in Safeguards',
      description: 'Block PII leakage, prompt injection, and malicious sources with security validation layers.'
    },
    {
      icon: <FaPlug />,
      title: 'Drop-in Integration',
      description: 'Works seamlessly with LangChain, LlamaIndex, and all major AI frameworks.'
    },
    {
      icon: <FaGlobe />,
      title: 'Real-time Web Access',
      description: 'Access fresh, up-to-date web content for grounding your AI models with current information.'
    },
    {
      icon: <FaLock />,
      title: 'Enterprise Security',
      description: 'SOC2 compliant, data encryption, and privacy-focused architecture built for production.'
    }
  ]

  return (
    <section id="features" className={`features-section ${isDark ? 'dark' : 'light'}`}>
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="features-badge">Features</span>
          <h2>Everything You Need for AI Web Access</h2>
          <p>
            Built for developers, trusted by enterprises. One API to connect your agents to the web.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

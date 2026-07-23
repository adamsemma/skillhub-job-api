import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { FaCheck, FaRocket } from '../common/Icons'
import './LandingComponents.css'

const Pricing = () => {
  const { isDark } = useTheme()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: isAnnual ? '0' : '0',
      description: 'Perfect for getting started',
      features: [
        '1,000 credits/month',
        'Basic search API',
        'Community support',
        'Rate limited'
      ],
      buttonText: 'Start Free',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Pro',
      price: isAnnual ? '25' : '30',
      description: 'For growing teams',
      features: [
        '4,000 credits/month',
        'Priority support',
        'Advanced analytics',
        'Higher rate limits',
        'Team collaboration'
      ],
      buttonText: 'Start Trial',
      buttonVariant: 'primary',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited credits',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'SOC2 compliant',
        'Private deployment'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false
    }
  ]

  return (
    <section id="pricing" className={`pricing-section ${isDark ? 'dark' : 'light'}`}>
      <div className="pricing-container">
        <motion.div 
          className="pricing-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="pricing-badge">Pricing</span>
          <h2>Choose the Plan That Fits Your Needs</h2>
          <div className="pricing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Monthly</span>
            <button 
              className={`toggle-switch ${isAnnual ? 'active' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <span className="toggle-track">
                <span className="toggle-thumb"></span>
              </span>
            </button>
            <span className={isAnnual ? 'active' : ''}>
              Annual <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <FaRocket /> Most Popular
                </div>
              )}
              <div className="pricing-card-header">
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="period">/month</span>
                  )}
                </div>
                <p className="pricing-description">{plan.description}</p>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <FaCheck className="feature-check" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to="/login" 
                className={`pricing-btn ${plan.buttonVariant}`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
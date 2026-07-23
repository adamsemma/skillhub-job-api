import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FaStar } from '../common/Icons'
import './LandingComponents.css'

const Testimonials = () => {
  const { isDark } = useTheme()

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI Engineer at Google',
      content: 'Tavily has completely transformed how we build AI agents. The ability to access real-time web data with such ease is game-changing.',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=667eea&color=fff'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO at AI Startup',
      content: 'We switched from building our own web search to Tavily and saw immediate improvements in both speed and accuracy.',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Michael+Rodriguez&background=764ba2&color=fff'
    },
    {
      name: 'Emily Watson',
      role: 'Lead Developer at Microsoft',
      content: 'The API is incredibly well-designed. We integrated it in under an hour and the results were immediately impressive.',
      rating: 4,
      image: 'https://ui-avatars.com/api/?name=Emily+Watson&background=48bb78&color=fff'
    }
  ]

  return (
    <section className={`testimonials-section ${isDark ? 'dark' : 'light'}`}>
      <div className="testimonials-container">
        <motion.div 
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="testimonials-badge">Testimonials</span>
          <h2>Loved by Developers Worldwide</h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < testimonial.rating ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
              <p className="testimonial-content">&quot;{testimonial.content}&quot;</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

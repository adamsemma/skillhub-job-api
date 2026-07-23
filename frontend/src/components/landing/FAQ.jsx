import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FaPlus, FaMinus } from '../common/Icons'
import './LandingComponents.css'

const FAQ = () => {
  const { isDark } = useTheme()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How does the API work?',
      answer: 'Our API searches the web in real-time, extracts relevant content, and returns it structured for AI models. Simply send a query and receive optimized results ready for RAG applications.'
    },
    {
      question: 'Is there a free tier?',
      answer: 'Yes! We offer a free tier with 1,000 credits per month to get started. This allows you to test the API and build your first AI agent without any cost.'
    },
    {
      question: 'What frameworks are supported?',
      answer: 'We support all major AI frameworks including LangChain, LlamaIndex, and direct REST API access. Our SDKs are available for Python, JavaScript, and more.'
    },
    {
      question: 'How secure is the service?',
      answer: 'We take security seriously with SOC2 compliance, end-to-end encryption, and built-in safeguards that block PII leakage, prompt injection, and malicious sources.'
    },
    {
      question: 'Can I use it for production workloads?',
      answer: 'Absolutely! We handle billions of API calls with 99.99% uptime and sub-200ms response times. Our enterprise tier includes SLA guarantees and dedicated support.'
    },
    {
      question: 'What types of content can I extract?',
      answer: 'Our API extracts clean, structured content from any web page including articles, documentation, forums, and more. We automatically remove ads, clutter, and navigation.'
    }
  ]

  return (
    <section id="faq" className={`faq-section ${isDark ? 'dark' : 'light'}`}>
      <div className="faq-container">
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="faq-badge">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button 
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-toggle">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
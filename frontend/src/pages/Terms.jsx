import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import './Pages.css'

const LAST_UPDATED = 'July 2026'

const SECTIONS = [
  {
    title: '1. Acceptance',
    body: [
      'By using SkillHub Search you agree to these terms. If you do not agree, please do not use the service.',
    ],
  },
  {
    title: '2. Acceptable use',
    body: [
      'Do not use the service to break the law, harass others, or attempt to gain unauthorised access to our systems.',
      'Do not use automated tooling to hammer the API beyond reasonable rate limits.',
      'Do not attempt to reverse engineer, resell, or rebrand the service without permission.',
    ],
  },
  {
    title: '3. AI-generated content',
    body: [
      'AI summaries are generated automatically and may be incomplete, outdated, or wrong.',
      'Always verify important information against the linked source before relying on it.',
      'You are responsible for how you use anything the service produces.',
    ],
  },
  {
    title: '4. Third-party content',
    body: [
      'Search results link to content owned by third parties. We do not control, endorse, or take responsibility for that content.',
    ],
  },
  {
    title: '5. Availability',
    body: [
      'The service is provided "as is", without warranty of any kind. We may change, suspend, or discontinue any part of it at any time.',
    ],
  },
  {
    title: '6. Changes to these terms',
    body: [
      'We may update these terms. Continued use after an update means you accept the revised version.',
    ],
  },
]

const Terms = () => {
  const { isDark } = useTheme()

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-subtitle">Last updated {LAST_UPDATED}</p>
        </div>
      </motion.div>

      <div className="legal-container">
        <motion.p
          className="legal-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          These terms govern your use of SkillHub Search. They are deliberately short.
        </motion.p>

        {SECTIONS.map((section, index) => (
          <motion.section
            key={section.title}
            className="legal-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <h2>{section.title}</h2>
            <ul>
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  )
}

export default Terms
import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import './Pages.css'

const LAST_UPDATED = 'July 2026'

const SECTIONS = [
  {
    title: 'What we collect',
    body: [
      'Search queries you submit, so we can return results and generate AI summaries.',
      'Basic usage data (pages visited, response times) used only to improve the service.',
      'Your theme and search preferences, stored locally in your browser.',
    ],
  },
  {
    title: 'What we do not collect',
    body: [
      'We do not sell your data to third parties.',
      'We do not build advertising profiles from your searches.',
      'We do not require an account to use search.',
    ],
  },
  {
    title: 'Where your data lives',
    body: [
      'Your search history is stored in your browser\u2019s local storage, on your device. Clearing it from the History page removes it permanently.',
      'Queries are sent to our API to fetch results, and to our AI provider to generate summaries when that option is enabled.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      'Disable "Usage Analytics" in Settings to stop sharing anonymised usage data.',
      'Disable "Auto Save History" in Settings to stop recording searches.',
      'Clear all stored searches at any time from the History page.',
    ],
  },
  {
    title: 'Contact',
    body: ['Questions about this policy can be sent to privacy@skillhub.example.'],
  },
]

const Privacy = () => {
  const { isDark } = useTheme()

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">Last updated {LAST_UPDATED}</p>
        </div>
      </motion.div>

      <div className="legal-container">
        <motion.p
          className="legal-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          This policy explains what SkillHub does with the information you give it when you
          search. It is written to be read, not to be skimmed past.
        </motion.p>

        {SECTIONS.map((section, index) => (
          <motion.section
            key={section.title}
            className="legal-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
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

export default Privacy
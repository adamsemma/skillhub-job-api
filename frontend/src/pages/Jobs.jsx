import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { jobsAPI } from '../services/api'
import '../styles/globals.css'

const Jobs = () => {
  const { isDark } = useTheme()
  const [query, setQuery] = useState('software engineer')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const payload = await jobsAPI(query, { max_results: 8 })
        setJobs(payload.jobs || [])
        setError('')
      } catch (err) {
        setError(err.message || 'Unable to load jobs')
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [query])

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Jobs Dashboard</h1>
          <p className="page-subtitle">Live job listings from the SkillHub API</p>
        </div>
      </motion.div>

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <label htmlFor="job-query" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Search jobs
        </label>
        <input
          id="job-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try software engineer, data analyst, product manager"
          style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
        />
      </div>

      {loading ? (
        <div className="card" style={{ padding: '1.25rem' }}>Loading jobs…</div>
      ) : error ? (
        <div className="card" style={{ padding: '1.25rem', color: '#dc2626' }}>{error}</div>
      ) : jobs.length === 0 ? (
        <div className="card" style={{ padding: '1.25rem' }}>No jobs found for this query.</div>
      ) : (
        <div className="results-grid">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id || `${job.title}-${index}`}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{ padding: '1.25rem' }}
            >
              <h3 style={{ marginTop: 0 }}>{job.title || 'Untitled role'}</h3>
              <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{job.company || 'Unknown company'}</p>
              <p style={{ margin: '0.25rem 0', color: '#64748b' }}>{job.location || 'Location not listed'}</p>
              <p style={{ margin: '0.75rem 0', lineHeight: 1.6 }}>{job.description || 'No description provided.'}</p>
              {job.source_url ? (
                <a href={job.source_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                  View listing
                </a>
              ) : null}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Jobs

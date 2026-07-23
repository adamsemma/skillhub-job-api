import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import './ResultSkeleton.css'

const ResultSkeleton = ({ count = 3 }) => {
  const { isDark } = useTheme()

  return (
    <div className={`result-skeleton-list ${isDark ? 'dark' : 'light'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div className="result-skeleton" key={i}>
          <div className="rs-line rs-title" />
          <div className="rs-line rs-url" />
          <div className="rs-line" />
          <div className="rs-line" />
          <div className="rs-line rs-short" />
        </div>
      ))}
    </div>
  )
}

export default ResultSkeleton

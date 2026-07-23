import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { searchAPI } from '../services/api'

const HISTORY_KEY = 'searchHistory'
const MAX_HISTORY = 20

export const useSearch = (filters = { maxResults: 5, includeAnswer: true }) => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch {
      setHistory([])
    }
  }, [])

  const search = useCallback(
    async (query) => {
      if (!query || !query.trim()) {
        toast.error('Please enter a search query')
        return
      }

      setLoading(true)
      setError(null)
      setResults(null)

      try {
        const response = await searchAPI(query, {
          max_results: filters.maxResults,
          include_answer: filters.includeAnswer,
        })

        setResults(response)

        setHistory((prev) => {
          const next = [
            {
              query,
              timestamp: new Date().toISOString(),
              results: response.results.length,
            },
            ...prev.filter((h) => h.query !== query),
          ].slice(0, MAX_HISTORY)
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
          return next
        })

        toast.success(
          `Found ${response.results.length} results in ${response.response_time.toFixed(2)}s`
        )
        return response
      } catch (err) {
        setError(err.message)
        toast.error(err.message || 'Search failed')
      } finally {
        setLoading(false)
      }
    },
    [filters.maxResults, filters.includeAnswer]
  )

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
  }, [])

  return { loading, results, error, history, search, clearHistory }
}

export default useSearch

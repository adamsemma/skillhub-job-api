const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'
const AUTH_STORAGE_KEY = 'skillhub.auth'

// When the backend isn't running, fall back to mock data so the UI stays usable.
// Set VITE_USE_MOCK=false in .env to disable and surface real errors instead.
const ALLOW_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK !== 'false'

const buildDemoUser = (email) => {
  const name = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return {
    id: `demo-${btoa(email).replace(/=+$/g, '')}`,
    name,
    email,
    role: 'Learner',
  }
}

const getAuthHeaders = () => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
  } catch {
    return {}
  }
}

const mockResponse = (query, maxResults, includeAnswer) => ({
  query,
  answer: includeAnswer
    ? `This is a mock AI summary for "${query}". The backend at ${API_BASE} is not reachable, so SkillHub is serving placeholder data. Start the API server to get real results.`
    : null,
  results: Array.from({ length: maxResults }, (_, i) => ({
    title: `${query} — sample result ${i + 1}`,
    url: `https://example.com/${encodeURIComponent(query)}/${i + 1}`,
    content: `Placeholder snippet ${i + 1} for "${query}". Real content will appear here once the backend is connected.`,
    score: Number((1 - i * 0.1).toFixed(2)),
  })),
  response_time: 0.42,
  mock: true,
})

/**
 * Search the web via the SkillHub backend.
 * @param {string} query
 * @param {{ max_results?: number, include_answer?: boolean }} options
 * @returns {Promise<{query: string, answer: string|null, results: Array, response_time: number}>}
 */
export const searchAPI = async (query, options = {}) => {
  const { max_results = 5, include_answer = true } = options
  const started = performance.now()

  let response
  try {
    response = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ query, max_results, include_answer }),
    })
  } catch {
    // Network-level failure: backend down, wrong port, CORS blocked, etc.
    if (ALLOW_MOCK_FALLBACK) {
      console.warn(`[SkillHub] ${API_BASE} unreachable — serving mock data.`)
      return mockResponse(query, max_results, include_answer)
    }
    throw new Error('Cannot reach the API. Is the backend running?')
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.detail || body.message || message
    } catch {
      /* error body wasn't JSON */
    }
    throw new Error(message)
  }

  const data = await response.json()

  return {
    query: data.query ?? query,
    answer: data.answer ?? null,
    results: Array.isArray(data.results) ? data.results : [],
    response_time:
      typeof data.response_time === 'number'
        ? data.response_time
        : (performance.now() - started) / 1000,
  }
}

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE}/health`)
  if (!response.ok) throw new Error('Backend is unhealthy')
  return response.json()
}

export const jobsAPI = async (query, options = {}) => {
  const { max_results = 5 } = options
  const response = await fetch(
    `${API_BASE}/api/dashboard/jobs?query=${encodeURIComponent(query)}&max_results=${max_results}`
  )

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.detail || body.message || message
    } catch {
      /* empty */
    }
    throw new Error(message)
  }

  return response.json()
}

export const loginAPI = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  let response

  try {
    response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    })
  } catch (error) {
    if (!ALLOW_MOCK_FALLBACK) throw error

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Enter a valid email address')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    return {
      token: `demo-token-${Date.now()}`,
      user: buildDemoUser(normalizedEmail),
      mock: true,
    }
  }

  if (response.ok) {
    const data = await response.json()
    return {
      token: data.token || data.access_token,
      user: data.user || buildDemoUser(normalizedEmail),
    }
  }

  let message = 'Invalid email or password'
  try {
    const body = await response.json()
    message = body.detail || body.message || message
  } catch {
    /* error body wasn't JSON */
  }
  throw new Error(message)
}

export default { searchAPI, jobsAPI, healthCheck, loginAPI }

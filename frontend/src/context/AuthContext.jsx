import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginAPI } from '../services/api'

const STORAGE_KEY = 'skillhub.auth'
const AuthContext = createContext()

const readStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredAuth)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const auth = await loginAPI(credentials)
      const nextSession = {
        token: auth.token,
        user: auth.user,
        mock: Boolean(auth.mock),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
      setSession(nextSession)
      return nextSession
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.token),
    isDemoSession: Boolean(session?.mock),
    loading,
    login,
    logout,
  }), [loading, login, logout, session])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

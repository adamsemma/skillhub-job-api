import React from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Sidebar from './components/common/Sidebar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Analytics from './pages/Analytics'
import History from './pages/History'
import Settings from './pages/Settings'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Docs from './pages/Docs'
import './styles/globals.css'

/**
 * Layout for signed-in app pages: sidebar + content.
 * Rendered behind ProtectedRoute via <Outlet />.
 */
const AppLayout = ({ children }) => (
  <div className="authenticated-layout">
    <Sidebar />
    <div className="authenticated-content">{children}</div>
  </div>
)

function App() {
  const { isDark } = useTheme()
  const location = useLocation()

  return (
    <div className={`app-wrapper ${isDark ? 'dark' : 'light'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1a202c' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#1a202c',
            borderRadius: '12px',
            padding: '16px',
          },
          success: { iconTheme: { primary: '#48bb78', secondary: '#fff' } },
          error: { iconTheme: { primary: '#fc8181', secondary: '#fff' } },
        }}
      />

      <Navbar />

      <div className="app-layout">
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* ---------- Public ---------- */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Navigate to="/login" replace />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/docs" element={<Docs />} />

              {/* ---------- Protected ---------- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/search" element={<AppLayout><Home /></AppLayout>} />
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/dashboard/jobs" element={<AppLayout><Jobs /></AppLayout>} />
                <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
                <Route path="/history" element={<AppLayout><History /></AppLayout>} />
                <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              </Route>

              {/* ---------- Fallback ---------- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default App
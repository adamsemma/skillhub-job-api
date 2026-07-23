import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { FaPalette, FaSlidersH, FaLock, FaBell, FaCloudUploadAlt } from '../components/common/Icons'
import { useTheme } from '../context/ThemeContext'
import './Pages.css'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    searchLanguage: 'All',
    safeSearch: true,
    cacheResults: true,
    analytics: true,
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings))
    toast.success('Settings saved')
  }

  const sections = [
    {
      title: 'Appearance',
      icon: <FaPalette />,
      settings: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'toggle',
          value: isDark,
          onChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Search Preferences',
      icon: <FaSlidersH />,
      settings: [
        {
          key: 'searchLanguage',
          label: 'Search Language',
          description: 'Preferred language for search results',
          type: 'select',
          options: ['All', 'English', 'Spanish', 'French', 'German', 'Chinese'],
          value: settings.searchLanguage,
        },
        {
          key: 'safeSearch',
          label: 'Safe Search',
          description: 'Filter explicit content from results',
          type: 'toggle',
          value: settings.safeSearch,
        },
        {
          key: 'cacheResults',
          label: 'Cache Results',
          description: 'Store search results for faster loading',
          type: 'toggle',
          value: settings.cacheResults,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      icon: <FaLock />,
      settings: [
        {
          key: 'analytics',
          label: 'Usage Analytics',
          description: 'Help improve the service by sharing usage data',
          type: 'toggle',
          value: settings.analytics,
        },
        {
          key: 'autoSave',
          label: 'Auto Save History',
          description: 'Automatically save your search history',
          type: 'toggle',
          value: settings.autoSave,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <FaBell />,
      settings: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Receive updates about your searches',
          type: 'toggle',
          value: settings.notifications,
        },
      ],
    },
  ]

  return (
    <div className={`page-container ${isDark ? 'dark' : 'light'}`}>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your search experience</p>
        </div>
      </motion.div>

      <div className="settings-container">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <div className="settings-header">
              <span className="settings-icon">{section.icon}</span>
              <h2>{section.title}</h2>
            </div>

            <div className="settings-items">
              {section.settings.map((setting) => (
                <div className="settings-item" key={setting.key}>
                  <div className="settings-item-content">
                    <div>
                      <h4>{setting.label}</h4>
                      {setting.description && <p>{setting.description}</p>}
                    </div>

                    {setting.type === 'toggle' ? (
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          className="toggle-input"
                          checked={setting.value}
                          onChange={() =>
                            setting.onChange ? setting.onChange() : handleToggle(setting.key)
                          }
                        />
                        <span className="toggle-slider" />
                      </label>
                    ) : setting.type === 'select' ? (
                      <select
                        className="settings-select"
                        value={setting.value}
                        onChange={(e) => handleSelect(setting.key, e.target.value)}
                      >
                        {setting.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          className="settings-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="save-btn" onClick={handleSave}>
            <FaCloudUploadAlt /> Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings

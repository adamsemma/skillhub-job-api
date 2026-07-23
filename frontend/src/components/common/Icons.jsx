/**
 * Local icon set — inline SVGs, zero dependencies.
 * Drop-in replacement for the `react-icons/fa` imports.
 */
import React from 'react'

const Svg = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
)

export const FaHome = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Svg>
)

export const FaThLarge = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </Svg>
)

export const FaChartBar = (p) => (
  <Svg {...p}>
    <path d="M3 21h18" />
    <rect x="5" y="11" width="3.5" height="7" rx="1" />
    <rect x="10.25" y="6" width="3.5" height="12" rx="1" />
    <rect x="15.5" y="14" width="3.5" height="4" rx="1" />
  </Svg>
)

export const FaChartLine = (p) => (
  <Svg {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-5 3 3 5-7" />
  </Svg>
)

export const FaHistory = (p) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3.5 2" />
  </Svg>
)

export const FaCog = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </Svg>
)

export const FaSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Svg>
)

export const FaGlobe = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </Svg>
)

export const FaClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
)

export const FaCalendar = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
)

export const FaDownload = (p) => (
  <Svg {...p}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </Svg>
)

export const FaCloudUploadAlt = (p) => (
  <Svg {...p}>
    <path d="M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9.5a3.5 3.5 0 0 1-.5 8.5" />
    <path d="M12 20v-8" />
    <path d="m9 15 3-3 3 3" />
  </Svg>
)

export const FaTrash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
)

export const FaFilter = (p) => (
  <Svg {...p}>
    <path d="M3 5h18l-7 8v6l-4 2v-8z" />
  </Svg>
)

export const FaPalette = (p) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.9 1.5-1.8-.3-1.3.6-2.2 1.9-2.2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z" />
    <circle cx="7.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="10" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="8" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const FaSlidersH = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Svg>
)

export const FaLock = (p) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
  </Svg>
)

export const FaBell = (p) => (
  <Svg {...p}>
    <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
    <path d="M10.5 19a2 2 0 0 0 3 0" />
  </Svg>
)

export const FaArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
)

export const FaTimes = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const FaBrain = (p) => (
  <Svg {...p}>
    <path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 5 9v1a2.5 2.5 0 0 0 1 2 2.5 2.5 0 0 0 1 4.5 2.5 2.5 0 0 0 2.5 2.5H12V4z" />
    <path d="M14.5 4A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19 9v1a2.5 2.5 0 0 1-1 2 2.5 2.5 0 0 1-1 4.5 2.5 2.5 0 0 1-2.5 2.5H12V4z" />
  </Svg>
)

export const FaCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
)

export const FaCheckCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.2 2.6 2.6L16 9.5" />
  </Svg>
)

export const FaCode = (p) => (
  <Svg {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m13.5 5-3 14" />
  </Svg>
)

export const FaPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const FaMinus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)

export const FaPlug = (p) => (
  <Svg {...p}>
    <path d="M9 3v6M15 3v6" />
    <path d="M7 9h10v2a5 5 0 0 1-10 0z" />
    <path d="M12 16v5" />
  </Svg>
)

export const FaRocket = (p) => (
  <Svg {...p}>
    <path d="M13.5 4.5c3-2 6.5-1.5 6.5-1.5s.5 3.5-1.5 6.5L14 14l-4-4z" />
    <path d="M10 14l-3 3" />
    <path d="M6.5 13.5 4 16l4 4 2.5-2.5" />
    <circle cx="15.5" cy="8.5" r="1.4" />
  </Svg>
)

export const FaShieldAlt = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v6c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const FaStar = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 3.6l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-3.9 5.6-.8z" />
  </Svg>
)

export const FaUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
)

export default {
  FaHome,
  FaThLarge,
  FaChartBar,
  FaChartLine,
  FaHistory,
  FaCog,
  FaSearch,
  FaGlobe,
  FaClock,
  FaCalendar,
  FaDownload,
  FaCloudUploadAlt,
  FaTrash,
  FaFilter,
  FaPalette,
  FaSlidersH,
  FaLock,
  FaBell,
  FaArrowRight,
  FaTimes,
  FaBrain,
  FaCheck,
  FaCheckCircle,
  FaCode,
  FaPlus,
  FaMinus,
  FaPlug,
  FaRocket,
  FaShieldAlt,
  FaStar,
  FaUser,
}
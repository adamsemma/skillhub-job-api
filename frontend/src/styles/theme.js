export const colors = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  danger: '#fc8181',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

export const light = {
  bg: '#f0f2f5',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#1a202c',
  textMuted: '#4a5568',
}

export const dark = {
  bg: '#0f0f1a',
  surface: '#1a202c',
  border: '#2d3748',
  text: '#e2e8f0',
  textMuted: '#a0aec0',
}

export const chartPalette = ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#fc8181', '#38b2ac']

export const getTheme = (isDark) => ({ ...colors, ...(isDark ? dark : light) })

export default { colors, light, dark, chartPalette, getTheme }

import React, { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Stats from '../components/landing/Stats'
import Pricing from '../components/landing/Pricing'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import '../styles/Landing.css'

const Landing = () => {
  const { isDark } = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`landing-page ${isDark ? 'dark' : 'light'}`}>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  )
}

export default Landing

import { useState, useEffect } from 'react'
import { fetchProfile, fetchExperience, fetchSkills } from './api/cvApi'
import Profile from './components/Profile'
import Experience from './components/Experience'
import Skills from './components/Skills'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [experience, setExperience] = useState(null)
  const [skills, setSkills] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [profileData, experienceData, skillsData] = await Promise.all([
          fetchProfile(),
          fetchExperience(),
          fetchSkills(),
        ])
        setProfile(profileData)
        setExperience(experienceData)
        setSkills(skillsData)
      } catch (err) {
        setError('Failed to load resume data. Please check that the API server is running.')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-badge">Dynamic CV</span>
          <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="header-api-link">
            API Docs
          </a>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <Profile data={profile} loading={loading} />
        <Experience data={experience} loading={loading} />
        <Skills data={skills} loading={loading} />
      </main>

      <footer className="app-footer">
        <p>Powered by FastAPI + React — metrics at <a href="/api/metrics">/api/metrics</a></p>
      </footer>
    </div>
  )
}

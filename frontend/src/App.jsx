import { useState, useEffect } from 'react'
import { fetchProfile, fetchExperience, fetchSkills } from './api/cvApi'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MetricsBar from './components/dashboard/MetricsBar'
import ProfileHero from './components/profile/ProfileHero'
import SkillsDashboard from './components/skills/SkillsDashboard'
import ExperienceTimeline from './components/experience/ExperienceTimeline'
import GitHubActivity from './components/github/GitHubActivity'
import ArchitectureModal from './components/architecture/ArchitectureModal'
import ProjectsGrid from './components/projects/ProjectsGrid'
import Education from './components/education/Education'
import ContactForm from './components/contact/ContactForm'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [experience, setExperience] = useState(null)
  const [skills, setSkills] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showArchitecture, setShowArchitecture] = useState(false)

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
    <div className="min-h-screen flex flex-col dark:bg-surface-950 bg-surface-50">
      <Header onOpenArchitecture={() => setShowArchitecture(true)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-14">
        {error && (
          <div className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        <MetricsBar />
        <ProfileHero data={profile} loading={loading} />
        <SkillsDashboard data={skills} loading={loading} />
        <ExperienceTimeline data={experience} loading={loading} />
        <GitHubActivity />
        <ProjectsGrid />
        <Education />
        <ContactForm />
      </main>

      <Footer />

      <ArchitectureModal
        open={showArchitecture}
        onClose={() => setShowArchitecture(false)}
      />
    </div>
  )
}
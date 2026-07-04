import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { fetchProjects } from '../../api/dashboardApi'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

export default function ProjectsGrid() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((d) => { if (!cancelled) setProjects(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section id="projects">
        <SectionHeading badge="work">Projects</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 h-40" />
          ))}
        </div>
      </section>
    )
  }

  if (!projects.length) return null

  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const display = [...featured, ...rest]

  return (
    <ScrollReveal>
      <section id="projects">
        <SectionHeading badge="work">Projects</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          {display.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 hover:border-accent-500/20 transition-all"
            >
              <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-2">
                {proj.name}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 leading-relaxed">
                {proj.description}
              </p>
              {proj.tech_stack && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.entries(proj.tech_stack).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-[10px] px-2 py-0.5 rounded font-mono bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400"
                    >
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1 text-accent-600 dark:text-accent-400 hover:underline"
                  >
                    <FiGithub className="w-3.5 h-3.5" /> Source
                  </a>
                )}
                {proj.live_url && (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1 text-surface-500 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  )
}
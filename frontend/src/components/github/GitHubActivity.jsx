import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi'
import { fetchGitHubActivity } from '../../api/dashboardApi'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

export default function GitHubActivity() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchGitHubActivity()
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section id="github">
        <SectionHeading badge="activity">GitHub</SectionHeading>
        <div className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 h-40" />
      </section>
    )
  }

  if (!data) return null

  return (
    <ScrollReveal>
      <section id="github">
        <SectionHeading badge="activity">GitHub</SectionHeading>

        <div className="flex flex-wrap gap-4 mb-5">
          <StatPill icon={FiStar} label="Repos" value={data.public_repos} />
          <StatPill icon={FiGitBranch} label="Followers" value={data.followers} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.recent_repos.map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="flex flex-col justify-between rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 hover:border-accent-500/20 transition-all group"
            >
              <div>
                <h4 className="font-semibold text-sm text-surface-800 dark:text-surface-200 flex items-center gap-2">
                  <FiExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent-500" />
                  {repo.name}
                </h4>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">
                  {repo.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">
                {repo.language && (
                  <span className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase">
                    {repo.language}
                  </span>
                )}
                <span className="text-[10px] text-surface-400 flex items-center gap-1">
                  <FiStar className="w-3 h-3" /> {repo.stargazers_count}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </ScrollReveal>
  )
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm">
      <Icon className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
      <span className="text-surface-500 dark:text-surface-400">{label}:</span>
      <span className="font-bold text-surface-900 dark:text-surface-100">{value}</span>
    </div>
  )
}
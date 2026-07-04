import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

const CATEGORY_ICONS = {
  'Orchestration & Containerization': '🐳',
  'CI/CD & GitOps': '⚡',
  'Infrastructure & Cloud': '☁️',
  'Observability': '📊',
  'DevSecOps & Code Quality': '🛡️',
  'OS & Scripting': '🐧',
  'Version Control': '🔀',
  'Databases': '🗄️',
}

const CATEGORY_HEX = {
  'Orchestration & Containerization': '#06b6d4',
  'CI/CD & GitOps': '#22c55e',
  'Infrastructure & Cloud': '#3b82f6',
  'Observability': '#a855f7',
  'DevSecOps & Code Quality': '#f59e0b',
  'OS & Scripting': '#ef4444',
  'Version Control': '#8b5cf6',
  'Databases': '#ec4899',
}

export default function SkillsDashboard({ data, loading }) {
  if (loading) {
    return (
      <section id="skills">
        <SectionHeading badge="stack">Technical Arsenal</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 h-36" />
          ))}
        </div>
      </section>
    )
  }

  if (!data?.categories) return null

  return (
    <ScrollReveal>
      <section id="skills">
        <SectionHeading badge="stack">Technical Arsenal</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.categories).map(([category, skills], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 hover:border-accent-500/20 transition-colors group"
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: CATEGORY_HEX[category] || '#64748b' }}
              />

              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{CATEGORY_ICONS[category] || '🔧'}</span>
                <h3 className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  {category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md
                               bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300
                               border border-surface-200 dark:border-surface-700
                               hover:border-accent-500/30 dark:hover:border-accent-500/30
                               hover:text-accent-600 dark:hover:text-accent-400
                               transition-all duration-200"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  )
}
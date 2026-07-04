import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

const LEVEL_COLORS = {
  expert: 'bg-accent-500',
  intermediate: 'bg-blue-500',
  beginner: 'bg-amber-500',
}

const LEVEL_WEIGHTS = {
  expert: 'w-full',
  intermediate: 'w-2/3',
  beginner: 'w-1/3',
}

const CATEGORY_ICONS = {
  'Cloud & Infrastructure': '☁️',
  'Containers & Orchestration': '📦',
  'CI/CD': '🔄',
  'Observability': '📊',
  'Programming': '⌨️',
  'Databases': '🗄️',
}

const CATEGORY_HEX = {
  'Cloud & Infrastructure': '#3b82f6',
  'Containers & Orchestration': '#06b6d4',
  'CI/CD': '#22c55e',
  'Observability': '#a855f7',
  'Programming': '#f59e0b',
  'Databases': '#ef4444',
}

export default function SkillsDashboard({ data, loading }) {
  if (loading) {
    return (
      <section id="skills">
        <SectionHeading badge="stack">Skills</SectionHeading>
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
        <SectionHeading badge="stack">Skills</SectionHeading>
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
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: CATEGORY_HEX[category] || '#64748b' }}
              />

              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{CATEGORY_ICONS[category] || '🔧'}</span>
                <h3 className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  {category}
                </h3>
              </div>

              <div className="space-y-2.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-semibold uppercase text-surface-400 dark:text-surface-500">
                          {skill.level}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-100 dark:bg-surface-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${LEVEL_COLORS[skill.level] || 'bg-surface-400'} ${LEVEL_WEIGHTS[skill.level] || 'w-1/2'}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  )
}
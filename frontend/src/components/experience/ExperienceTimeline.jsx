import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function ExperienceTimeline({ data, loading }) {
  if (loading) {
    return (
      <section id="experience">
        <SectionHeading>Experience</SectionHeading>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <div className="h-5 w-48 rounded bg-surface-200 dark:bg-surface-700 mb-2" />
              <div className="h-4 w-32 rounded bg-surface-200 dark:bg-surface-700 mb-3" />
              <div className="h-3 w-full rounded bg-surface-200 dark:bg-surface-700" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!data?.items?.length) return null

  return (
    <ScrollReveal>
      <section id="experience">
        <SectionHeading>Experience</SectionHeading>
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-surface-200 dark:bg-surface-800" />

          <div className="space-y-6">
            {data.items.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-[4px] top-2 w-[15px] h-[15px] rounded-full bg-accent-500 ring-4 ring-surface-50 dark:ring-surface-950 shadow-sm" />

                <div className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 hover:border-accent-500/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-medium text-surface-400 dark:text-surface-500 font-mono whitespace-nowrap">
                      {formatDate(exp.start_date)} → {formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-accent-600 dark:text-accent-400 mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
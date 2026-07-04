import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBookOpen } from 'react-icons/fi'
import { fetchEducation } from '../../api/dashboardApi'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

export default function Education() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchEducation()
      .then((d) => { if (!cancelled) setEducation(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section id="education">
        <SectionHeading>Education</SectionHeading>
        <div className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 h-28" />
      </section>
    )
  }

  if (!education.length) return null

  return (
    <ScrollReveal>
      <section id="education">
        <SectionHeading>Education</SectionHeading>
        {education.map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                <FiBookOpen className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-surface-900 dark:text-surface-100">
                  {edu.institution}
                </h3>
                <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 font-mono">
                  {edu.period}
                </p>
                {edu.description && (
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </ScrollReveal>
  )
}
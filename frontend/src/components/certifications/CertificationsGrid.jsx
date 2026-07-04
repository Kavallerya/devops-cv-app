import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiExternalLink } from 'react-icons/fi'
import { fetchCertifications } from '../../api/dashboardApi'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

const ISSUER_COLORS = {
  'CNCF': 'border-l-blue-500',
  'AWS': 'border-l-amber-500',
  'HashiCorp': 'border-l-violet-500',
}

function getIssuerColor(issuer) {
  for (const [key, color] of Object.entries(ISSUER_COLORS)) {
    if (issuer.includes(key)) return color
  }
  return 'border-l-accent-500'
}

export default function CertificationsGrid() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchCertifications()
      .then((d) => { if (!cancelled) setCerts(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section id="certs">
        <SectionHeading badge="certs">Certifications</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 h-20" />
          ))}
        </div>
      </section>
    )
  }

  if (!certs.length) return null

  return (
    <ScrollReveal>
      <section id="certs">
        <SectionHeading badge="certs">Certifications</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-3">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className={`border-l-2 ${getIssuerColor(cert.issuer)} rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 hover:border-accent-500/20 transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                  <FiAward className="w-4.5 h-4.5 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-surface-800 dark:text-surface-200">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {cert.issuer}
                  </p>
                  <p className="text-[10px] text-surface-400 font-mono mt-1">
                    {cert.date} {cert.expiry_date ? `→ ${cert.expiry_date}` : ''}
                  </p>
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-surface-400 hover:text-accent-500 transition-colors"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
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
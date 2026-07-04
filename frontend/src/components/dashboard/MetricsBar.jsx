import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiActivity, FiUsers, FiClock, FiServer } from 'react-icons/fi'
import { fetchStatus } from '../../api/dashboardApi'
import ScrollReveal from '../ui/ScrollReveal'

function MetricCard({ icon: Icon, label, value, suffix = '', delay }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="relative overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 hover:border-accent-500/30 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1 tabular-nums">
              {value}
              <span className="text-base font-normal text-surface-400 ml-0.5">{suffix}</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-accent-600 dark:text-accent-400" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/3 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>
    </ScrollReveal>
  )
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function MetricsBar() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchStatus()
      .then((data) => { if (!cancelled) setStatus(data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <ScrollReveal>
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10 px-2.5 py-1 rounded-full font-mono">
          <span className="status-dot w-2 h-2 rounded-full bg-accent-500" />
          system: online
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5">
              <div className="h-3 w-16 rounded bg-surface-200 dark:bg-surface-700 mb-3" />
              <div className="h-7 w-20 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
          ))
        ) : (
          <>
            <MetricCard
              icon={FiActivity}
              label="Uptime"
              value={status ? formatUptime(status.uptime_seconds) : '—'}
              delay={0}
            />
            <MetricCard
              icon={FiUsers}
              label="Visitors"
              value={status?.visitor_count ?? '—'}
              delay={0.1}
            />
            <MetricCard
              icon={FiClock}
              label="Response"
              value="142"
              suffix="ms"
              delay={0.2}
            />
            <MetricCard
              icon={FiServer}
              label="Deployed on"
              value="GKE"
              delay={0.3}
            />
          </>
        )}
      </div>
    </ScrollReveal>
  )
}
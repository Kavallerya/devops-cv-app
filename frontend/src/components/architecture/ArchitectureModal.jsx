import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGitCommit, FiServer, FiBox } from 'react-icons/fi'

const TABS = [
  { id: 'cicd', label: 'CI/CD Pipeline', icon: FiGitCommit },
  { id: 'infra', label: 'Infrastructure', icon: FiServer },
  { id: 'k8s', label: 'Kubernetes Cluster', icon: FiBox },
]

const STEPS = [
  { label: 'Push to GitHub', detail: 'devops-cv-app/main' },
  { label: 'Quality Checks', detail: 'ruff + pytest + Trivy' },
  { label: 'Build & Push', detail: 'Docker Hub :sha' },
  { label: 'Update Infra Repo', detail: 'sed tag → commit → push' },
  { label: 'ArgoCD Sync', detail: 'auto selfHeal + prune' },
  { label: 'Rolling Update', detail: 'GKE deployments' },
]

const INFRA_LAYERS = [
  { label: 'Cloudflare DNS', sub: 'imorozov.xyz', color: 'from-orange-500 to-orange-400', items: ['A records', 'DNS-01 ACME'] },
  { label: 'Nginx Ingress', sub: 'GCP L4 LoadBalancer', color: 'from-blue-500 to-blue-400', items: ['TLS termination', 'cert-manager'] },
  { label: 'Frontend :80', sub: 'React SPA via Nginx', color: 'from-green-500 to-green-400', items: ['Security headers', 'SPA fallback'] },
  { label: 'Backend :8000', sub: 'FastAPI / Uvicorn', color: 'from-violet-500 to-violet-400', items: ['Prometheus metrics', 'Async SQLAlchemy'] },
  { label: 'PostgreSQL :5432', sub: '5Gi PVC', color: 'from-cyan-500 to-cyan-400', items: ['Internal only', 'GCP Secret Manager'] },
]

const K8S_DETAILS = [
  { label: 'Nodes', value: '2x e2-standard-4' },
  { label: 'Region', value: 'europe-central2' },
  { label: 'Workload Identity', value: 'Enabled' },
  { label: 'ArgoCD Apps', value: '7 applications' },
  { label: 'Monitoring', value: 'Prometheus + Loki + Grafana' },
]

export default function ArchitectureModal({ open, onClose }) {
  const [tab, setTab] = useState('cicd')

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [open, handleKeyDown])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl
                       border border-surface-200 dark:border-surface-700
                       bg-white dark:bg-surface-900 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                System Architecture
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-1 mb-5 bg-surface-100 dark:bg-surface-800/50 rounded-lg p-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                    tab === t.id
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                      : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'cicd' && <CICDFlow />}
            {tab === 'infra' && <InfraDiagram />}
            {tab === 'k8s' && <K8sOverview />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function CICDFlow() {
  return (
    <div>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-5">
        GitOps delivery pipeline — from code push to production deployment
      </p>
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg
                         bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700
                         min-w-[100px]"
            >
              <span className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 text-center">
                {step.label}
              </span>
              <span className="text-[10px] text-surface-400 font-mono text-center">
                {step.detail}
              </span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <span className="text-surface-300 dark:text-surface-600 text-lg">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InfraDiagram() {
  return (
    <div>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-5">
        Request flow through the infrastructure stack
      </p>
      <div className="space-y-2">
        {INFRA_LAYERS.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-lg bg-gradient-to-r ${layer.color} p-0.5`}
          >
            <div className="bg-white dark:bg-surface-900 rounded-[6px] p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                  {layer.label}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {layer.sub}
                </p>
              </div>
              <div className="flex gap-2">
                {layer.items.map((item) => (
                  <span key={item} className="text-[10px] px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        <div className="text-center text-surface-300 dark:text-surface-600 text-sm pt-1">▼</div>
        <div className="rounded-lg bg-gradient-to-r from-slate-500 to-slate-400 p-0.5">
          <div className="bg-white dark:bg-surface-900 rounded-[6px] p-3">
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
              External Secrets
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              GCP Secret Manager → Kubernetes Secrets
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function K8sOverview() {
  return (
    <div>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-5">
        GKE cluster configuration and deployed resources
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {K8S_DETAILS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center justify-between p-3 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
          >
            <span className="text-sm text-surface-500 dark:text-surface-400">{item.label}</span>
            <span className="text-sm font-semibold text-surface-800 dark:text-surface-200 font-mono">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
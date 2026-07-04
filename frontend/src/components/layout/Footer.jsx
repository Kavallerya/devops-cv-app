import { FiGithub, FiMonitor, FiCode } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-surface-100 dark:bg-surface-900/50">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
          <a
            href="https://github.com/Kavallerya/devops-cv-app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-surface-700 dark:hover:text-surface-200 transition-colors flex items-center gap-1.5"
          >
            <FiGithub className="w-4 h-4" />
            Source
          </a>
          <span className="text-surface-300 dark:text-surface-700">|</span>
          <a
            href="https://monitor.imorozov.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-surface-700 dark:hover:text-surface-200 transition-colors flex items-center gap-1.5"
          >
            <FiMonitor className="w-4 h-4" />
            Monitoring
          </a>
          <span className="text-surface-300 dark:text-surface-700">|</span>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-surface-700 dark:hover:text-surface-200 transition-colors flex items-center gap-1.5"
          >
            <FiCode className="w-4 h-4" />
            API
          </a>
        </div>
        <p className="text-xs text-surface-400 dark:text-surface-500">
          Built with FastAPI + React + Kubernetes &middot; GitOps via ArgoCD
        </p>
      </div>
    </footer>
  )
}
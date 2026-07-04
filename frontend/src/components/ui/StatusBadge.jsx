export default function StatusBadge({ status }) {
  const colors = {
    healthy: 'bg-accent-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 dark:text-surface-400">
      <span className={`status-dot w-2 h-2 rounded-full ${colors[status] || colors.down}`} />
      <span className="capitalize">{status}</span>
    </span>
  )
}
export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3 p-6 rounded-xl bg-surface-200 dark:bg-surface-800/50">
      <div className="h-5 w-2/3 rounded bg-surface-300 dark:bg-surface-700" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 rounded bg-surface-300 dark:bg-surface-700" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  )
}
export default function SectionHeading({ children, badge }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
        {children}
      </h2>
      {badge && (
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400 font-mono">
          {badge}
        </span>
      )}
    </div>
  )
}
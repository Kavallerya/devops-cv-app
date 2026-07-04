import { HiOutlineDocumentArrowDown } from 'react-icons/hi2'
import { FiLayers } from 'react-icons/fi'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_ITEMS = [
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Header({ onOpenArchitecture }) {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
            I
          </span>
          <span className="font-semibold text-surface-900 dark:text-surface-100 hidden sm:inline">
            Illya
          </span>
          <span className="hidden sm:inline text-surface-400">|</span>
          <span className="text-sm text-surface-500 dark:text-surface-400 hidden sm:inline">
            DevOps Engineer
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 rounded-md border border-surface-200 dark:border-surface-700 hover:border-accent-500/50 transition-colors"
          >
            <FiLayers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Architecture</span>
          </button>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 rounded-md border border-surface-200 dark:border-surface-700 hover:border-accent-500/50 transition-colors"
          >
            API Docs
          </a>
          <a
            href="/cv-illia-morozov.pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-md transition-colors"
          >
            <HiOutlineDocumentArrowDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CV</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
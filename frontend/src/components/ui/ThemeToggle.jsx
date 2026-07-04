import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <FiSun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          } text-yellow-400`}
        />
        <FiMoon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          } text-surface-600 dark:text-surface-400`}
        />
      </div>
    </button>
  )
}
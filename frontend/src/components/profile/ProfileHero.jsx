import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub } from 'react-icons/fi'
import ScrollReveal from '../ui/ScrollReveal'

function ContactChip({ icon: Icon, label, href, external }) {
  const Component = href ? 'a' : 'span'
  return (
    <Component
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium
                 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300
                 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100
                 border border-surface-200 dark:border-surface-700 hover:border-accent-500/30 transition-all"
    >
      <Icon className="w-4 h-4 text-accent-600 dark:text-accent-400" />
      {label}
    </Component>
  )
}

export default function ProfileHero({ data, loading }) {
  if (loading) {
    return (
      <section id="about" className="pt-2 pb-4">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-surface-200 dark:bg-surface-700" />
          <div className="h-8 w-48 mx-auto rounded bg-surface-200 dark:bg-surface-700" />
          <div className="h-4 w-64 mx-auto rounded bg-surface-200 dark:bg-surface-700" />
          <div className="h-16 w-96 max-w-full mx-auto rounded bg-surface-200 dark:bg-surface-700" />
        </div>
      </section>
    )
  }

  if (!data) return null

  return (
    <ScrollReveal>
      <section id="about" className="pt-4 pb-8 text-center">
        <div
          className="w-20 h-20 mx-auto rounded-2xl bg-accent-500 flex items-center justify-center
                     text-white text-2xl font-bold shadow-lg shadow-accent-500/20 ring-4 ring-accent-50 dark:ring-accent-500/10"
        >
          {data.name.charAt(0)}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-surface-100 mt-5 tracking-tight">
          {data.name}
        </h1>
        <p className="text-lg text-accent-600 dark:text-accent-400 font-medium mt-1">
          {data.title}
        </p>

        {data.location && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 font-mono">
            📍 {data.location}
          </p>
        )}

        <p className="max-w-2xl mx-auto text-surface-500 dark:text-surface-400 mt-4 leading-relaxed text-sm">
          Building scalable infrastructure, automating complex workflows, and enforcing
          clean CI/CD pipelines. This interactive portfolio is self-hosted, containerized,
          and deployed via ArgoCD on a Kubernetes cluster.
        </p>

        <p className="max-w-2xl mx-auto text-surface-500 dark:text-surface-400 mt-3 leading-relaxed text-sm">
          {data.summary}
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mt-6">
          <ContactChip icon={FiMail} label={data.email} href={`mailto:${data.email}`} />
          {data.phone && (
            <ContactChip icon={FiPhone} label={data.phone} href={`tel:${data.phone}`} />
          )}
          {data.location && (
            <ContactChip icon={FiMapPin} label={data.location} />
          )}
          {data.linkedin && (
            <ContactChip icon={FiLinkedin} label="LinkedIn" href={data.linkedin} external />
          )}
          {data.github && (
            <ContactChip icon={FiGithub} label="GitHub" href={data.github} external />
          )}
        </div>
      </section>
    </ScrollReveal>
  )
}
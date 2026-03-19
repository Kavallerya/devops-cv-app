function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function Experience({ data, loading }) {
  if (loading) {
    return (
      <section className="section">
        <h2 className="section-title">Experience</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="timeline-item skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
            <div className="skeleton skeleton-text" />
          </div>
        ))}
      </section>
    )
  }

  if (!data?.items?.length) return null

  return (
    <section className="section">
      <h2 className="section-title">Experience</h2>
      <div className="timeline">
        {data.items.map((exp) => (
          <div key={exp.id} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-header">
                <h3 className="timeline-role">{exp.role}</h3>
                <span className="timeline-dates">
                  {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                </span>
              </div>
              <p className="timeline-company">{exp.company}</p>
              <p className="timeline-description">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Profile({ data, loading }) {
  if (loading) {
    return (
      <section className="profile-section">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text short" />
      </section>
    )
  }

  if (!data) return null

  return (
    <section className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">{data.name.charAt(0)}</div>
        <div className="profile-info">
          <h1 className="profile-name">{data.name}</h1>
          <p className="profile-title">{data.title}</p>
          {data.location && <p className="profile-location">{data.location}</p>}
        </div>
      </div>
      <p className="profile-summary">{data.summary}</p>
      <div className="profile-contacts">
        <a href={`mailto:${data.email}`} className="contact-link">
          <span className="contact-icon">✉</span>
          {data.email}
        </a>
        {data.phone && (
          <a href={`tel:${data.phone}`} className="contact-link">
            <span className="contact-icon">☎</span>
            {data.phone}
          </a>
        )}
        {data.linkedin && (
          <a href={data.linkedin} className="contact-link" target="_blank" rel="noopener noreferrer">
            <span className="contact-icon">in</span>
            LinkedIn
          </a>
        )}
        {data.github && (
          <a href={data.github} className="contact-link" target="_blank" rel="noopener noreferrer">
            <span className="contact-icon">⌥</span>
            GitHub
          </a>
        )}
      </div>
    </section>
  )
}

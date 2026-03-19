const LEVEL_CONFIG = {
  expert: { label: 'Expert', color: '#22c55e', width: '100%' },
  intermediate: { label: 'Intermediate', color: '#3b82f6', width: '66%' },
  beginner: { label: 'Beginner', color: '#f59e0b', width: '33%' },
}

function SkillBadge({ skill }) {
  const config = LEVEL_CONFIG[skill.level] ?? LEVEL_CONFIG.intermediate
  return (
    <div className="skill-item">
      <div className="skill-header">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-level-label" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: config.width, backgroundColor: config.color }}
        />
      </div>
    </div>
  )
}

export default function Skills({ data, loading }) {
  if (loading) {
    return (
      <section className="section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skill-category-card">
              <div className="skeleton skeleton-subtitle" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="skeleton skeleton-text" />
              ))}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!data?.categories) return null

  return (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {Object.entries(data.categories).map(([category, skills]) => (
          <div key={category} className="skill-category-card">
            <h3 className="skill-category-title">{category}</h3>
            {skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

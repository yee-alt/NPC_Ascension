const ROLE_COLORS = {
  '路人甲':         '#888888',
  '天命女配·病弱觉醒型': '#ffd700',
  '天命女配·强者逆袭型': '#ffd700',
  '天命女配·智慧谋略型': '#ffd700',
  '天命女配·魅力无双型': '#ffd700',
  '爽文女主':        '#ff8cc8',
  '反派女配':        '#e04040',
  '反派女主':        '#8b1a1a',
}

const getMaxAwakening = (role) => {
  if (role === '路人甲') return 20
  if (role.includes('女配')) return 200
  return 200
}

export default function StatsPanel({ state }) {
  const { role, awakening, cognition, unlockedSkills = [], avatar } = state
  const max      = getMaxAwakening(role)
  const progress = Math.min((awakening / max) * 100, 100)
  const color    = ROLE_COLORS[role] || '#ffd700'
  const remaining = Math.max(max - awakening, 0)

  return (
    <div className="stats-panel">
      {avatar && (
        <div className="stats-avatar-wrap">
          <img src={avatar} className="stats-avatar" alt="宿主" />
        </div>
      )}

      <div className="stats-info">
        <div className="stats-role-badge" style={{ color }}>
          {role}
        </div>

        <div className="stats-row">
          <span className="stats-label">觉醒值</span>
          <div className="stats-bar-wrap">
            <div className="stats-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="stats-value">{awakening}/{max}</span>
        </div>

        <div className="stats-row">
          <span className="stats-label">认知</span>
          <span className="stats-value">{cognition}</span>
          <span className="stats-hint" style={{ marginLeft: 'auto' }}>
            {remaining > 0 && (
              <>距离晋升：还差 <span>{remaining}</span> 点</>
            )}
          </span>
        </div>
      </div>

      <div className="stats-skills-count">
        ✦ {unlockedSkills.length} / 20
      </div>
    </div>
  )
}

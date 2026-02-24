import { useState, useEffect } from 'react'
import { sfx, voice } from '../sound'

// Generate random particle styles
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle  = (i / 16) * 360
  const dist   = 80 + Math.random() * 80
  const tx     = Math.cos((angle * Math.PI) / 180) * dist
  const ty     = Math.sin((angle * Math.PI) / 180) * dist
  const delay  = Math.random() * 0.3
  return { tx, ty, delay }
})

export default function UpgradeAnimation({ state, updateState }) {
  const [stage, setStage] = useState('flash')   // flash | reveal | complete

  useEffect(() => {
    sfx.upgrade()
    const t1 = setTimeout(() => {
      setStage('reveal')
      voice.upgrade(newRole)
    }, 900)
    const t2 = setTimeout(() => setStage('complete'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const newRole = state.newRole || '天命女配'
  const remaining = Math.max(200 - state.awakening, 0)

  const handleContinue = () => {
    updateState({ phase: 'starmap', role: newRole, newRole: null })
  }

  return (
    <div className="upgrade-overlay">
      {stage === 'flash' && <div className="upgrade-flash" />}
      <div className="upgrade-bg-glow" />

      {stage !== 'flash' && (
        <div className="upgrade-content fade-in">
          {/* Particles */}
          <div className="upgrade-particles-wrap">
            {PARTICLES.map((p, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${0.9 + Math.random() * 0.4}s`,
                  top: '50%',
                  left: '50%',
                }}
              />
            ))}
          </div>

          <p className="upgrade-pre fade-in" style={{ animationDelay: '0.1s' }}>
            恭喜宿主突破凡人桎梏
          </p>
          <p className="upgrade-action fade-in" style={{ animationDelay: '0.3s' }}>
            命格重塑完成
          </p>
          <div className="upgrade-divider fade-in" style={{ animationDelay: '0.5s' }} />
          <p className="upgrade-label fade-in" style={{ animationDelay: '0.6s' }}>
            当前身份
          </p>
          <h1 className="upgrade-role gold-pulse fade-in" style={{ animationDelay: '0.7s' }}>
            {newRole}
          </h1>

          <div className="upgrade-stats-row fade-in" style={{ animationDelay: '1s' }}>
            <div>觉醒值：{state.awakening} &nbsp;·&nbsp; 认知：{state.cognition}</div>
            <div className="next-hint">
              距离爽文女主：还差 {remaining} 点觉醒值
            </div>
          </div>

          {stage === 'complete' && (
            <button
              className="btn btn-primary fade-in"
              style={{ animationDelay: '0.1s', marginTop: 8 }}
              onClick={handleContinue}
            >
              继续觉醒之旅 →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

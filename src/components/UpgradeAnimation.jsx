import { useState, useEffect } from 'react'
import { sfx, voice } from '../sound'

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle   = (i / 28) * 360
  const dist    = 60 + Math.random() * 130
  const tx      = Math.cos((angle * Math.PI) / 180) * dist
  const ty      = Math.sin((angle * Math.PI) / 180) * dist
  const delay   = Math.random() * 0.5
  const size    = 4 + Math.random() * 7
  const isWhite = i % 6 === 0
  return { tx, ty, delay, size, isWhite }
})

const RINGS = [0, 0.35, 0.7]

export default function UpgradeAnimation({ state, updateState }) {
  const [stage, setStage] = useState('flash')

  const newRole   = state.newRole || '天命女配'
  const remaining = Math.max(200 - state.awakening, 0)

  useEffect(() => {
    sfx.upgrade()
    const t1 = setTimeout(() => {
      setStage('reveal')
      voice.upgrade(newRole)
    }, 900)
    const t2 = setTimeout(() => setStage('complete'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleContinue = () => {
    updateState({ phase: 'starmap', role: newRole, newRole: null })
  }

  return (
    <div className="upgrade-overlay">
      {stage === 'flash' && <div className="upgrade-flash" />}
      <div className="upgrade-bg-glow" />

      {stage !== 'flash' && (
        <>
          {/* Expanding corona rings */}
          {RINGS.map((delay, i) => (
            <div key={i} className="upgrade-ring" style={{ animationDelay: `${delay}s` }} />
          ))}

          <div className="upgrade-content fade-in">
            {/* Particles */}
            <div className="upgrade-particles-wrap">
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  className={`particle ${p.isWhite ? 'particle-white' : ''}`}
                  style={{
                    '--tx': `${p.tx}px`,
                    '--ty': `${p.ty}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${1.0 + Math.random() * 0.6}s`,
                    width:  `${p.size}px`,
                    height: `${p.size}px`,
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
            <div className="upgrade-divider-fancy fade-in" style={{ animationDelay: '0.5s' }} />
            <p className="upgrade-label fade-in" style={{ animationDelay: '0.6s' }}>
              当前身份
            </p>
            <h1 className="upgrade-role upgrade-role-pop" style={{ animationDelay: '0.7s' }}>
              {newRole}
            </h1>

            <div className="upgrade-stats-row fade-in" style={{ animationDelay: '1.1s' }}>
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
        </>
      )}
    </div>
  )
}

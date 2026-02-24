import { useState, useRef, useEffect } from 'react'
import { SKILLS, STAR_POSITIONS, FEMALE_LEAD_TYPES } from '../data/skills'
import StatsPanel from './StatsPanel'
import SkillModal from './SkillModal'

export default function StarMap({ state, updateState }) {
  const [selected, setSelected] = useState(null)
  const [flashing, setFlashing] = useState(null)
  const [ringing,  setRinging]  = useState(null)
  const [lastGain, setLastGain] = useState(null)

  // 用 ref 追踪组件是否还挂载着 + 保存定时器 id
  const mountedRef = useRef(true)
  const timerRef   = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      // 组件卸载（包括点重置）时立即取消所有待执行的 setTimeout
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
  }, [])

  const handleStarClick = (skill) => {
    if (state.unlockedSkills.includes(skill.id)) return
    setSelected(skill)
  }

  const handleUnlock = (skillId) => {
    setSelected(null)
    setFlashing(skillId)
    setRinging(skillId)

    const newAwakening = state.awakening + 1
    const newCognition = state.cognition + 2
    const newUnlocked  = [...state.unlockedSkills, skillId]

    setLastGain({ aw: newAwakening, cog: newCognition })

    // 保存 timer id，方便卸载时取消
    timerRef.current = setTimeout(() => {
      // 如果组件已经被卸载（比如用户点了重置），直接忽略
      if (!mountedRef.current) return

      setFlashing(null)
      setRinging(null)

      const shouldUpgrade = newAwakening >= 20 && state.role === '路人甲'

      if (shouldUpgrade) {
        const newRole = FEMALE_LEAD_TYPES[Math.floor(Math.random() * FEMALE_LEAD_TYPES.length)]
        updateState({
          awakening:      newAwakening,
          cognition:      newCognition,
          unlockedSkills: newUnlocked,
          phase:          'upgrade',
          newRole,
        })
      } else {
        updateState({
          awakening:      newAwakening,
          cognition:      newCognition,
          unlockedSkills: newUnlocked,
        })
      }
    }, 1400)
  }

  return (
    <div className="starmap-page">
      {/* Top bar */}
      <StatsPanel state={state} />

      {/* Main area */}
      <div className="starmap-body">
        <h2 className="starmap-title gold-text">第一阶段 · 基础觉醒</h2>
        <p className="starmap-sub">点亮 20 项能力，突破凡人桎梏</p>

        <div className="stars-container">
          {SKILLS.map((skill, i) => {
            const pos      = STAR_POSITIONS[i]
            const unlocked = state.unlockedSkills.includes(skill.id)
            const isFlash  = flashing === skill.id
            const isRing   = ringing  === skill.id

            return (
              <div
                key={skill.id}
                className={`star-node ${unlocked ? 'unlocked' : 'locked'} ${isFlash ? 'flashing' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handleStarClick(skill)}
              >
                {isRing && <div className="star-ring animating" />}
                <div className="star-core">
                  {unlocked ? '★' : '☆'}
                </div>
                <div className="star-label">{skill.name}</div>
              </div>
            )
          })}
        </div>

        {/* Progress hint below stars */}
        {lastGain && (
          <p className="starmap-progress-hint fade-in" key={lastGain.aw}>
            觉醒值 {lastGain.aw} / {state.role === '路人甲' ? 20 : 200}
            &nbsp;·&nbsp;
            距晋升还差 {Math.max((state.role === '路人甲' ? 20 : 200) - lastGain.aw, 0)} 点
          </p>
        )}
      </div>

      {selected && (
        <SkillModal
          skill={selected}
          onUnlock={handleUnlock}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { sfx, voice } from '../sound'

const BINDING_LINES = [
  '恭喜宿主拒绝平庸命运。',
  '正在绑定 ——',
  '《爽文女主觉醒系统》',
  '觉醒路径已开启。',
  '第一阶段任务生成中……',
]

export default function SystemChoice({ state, updateState }) {
  const [bound, setBound]   = useState(false)
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    if (!bound) return
    if (lineIdx >= BINDING_LINES.length) {
      const t = setTimeout(() => updateState({ phase: 'starmap', system: 'rise' }), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIdx(i => i + 1), 650)
    return () => clearTimeout(t)
  }, [bound, lineIdx])

  if (bound) {
    return (
      <div className="binding-screen fade-in">
        <div className="binding-glow" />
        {BINDING_LINES.slice(0, lineIdx).map((line, i) => (
          <p
            key={i}
            className={`fade-in ${i === 2 ? 'binding-system-name' : 'binding-line'}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="choice-page fade-in">
      <div className="choice-card">
        {state.avatar && (
          <img src={state.avatar} className="choice-avatar" alt="宿主" />
        )}
        <p className="choice-role">
          当前身份：<span className="gold-text">路人甲</span>
        </p>
        <h2>是否绑定系统？</h2>
        <div className="choice-buttons">
          <button
            className="btn btn-ghost"
            onClick={() => {
              sfx.warning()
              setTimeout(() => voice.bindLayflat(), 300)
              updateState({ phase: 'layflat', system: 'layflat' })
            }}
          >
            🐟 绑定咸鱼躺平系统
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              sfx.bind()
              setTimeout(() => voice.bindRise(), 400)
              setBound(true)
              setLineIdx(0)
            }}
          >
            ⚡ 绑定《爽文女主觉醒系统》
          </button>
        </div>
      </div>
    </div>
  )
}

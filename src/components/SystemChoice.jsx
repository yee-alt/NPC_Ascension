import { useState, useEffect } from 'react'
import { sfx, voice } from '../sound'

const BINDING_LINES = [
  '恭喜宿主拒绝平庸命运。',
  '正在绑定 ——',
  '《爽文女主觉醒系统》',
  '觉醒路径已开启。',
  '第一阶段任务生成中……',
]

// 每行出现时机（ms），与语音节奏对齐（voice rate 0.78）
const LINE_DELAYS  = [100, 1600, 2700, 3900, 5000]
const DONE_DELAY   = 6500

export default function SystemChoice({ state, updateState }) {
  const [bound, setBound] = useState(false)
  const [shown, setShown] = useState([])   // 已显示行的索引集合

  useEffect(() => {
    if (!bound) return
    // 各行按精确延迟逐条出现
    const lineTimers = LINE_DELAYS.map((delay, i) =>
      setTimeout(() => setShown(s => [...s, i]), delay)
    )
    // 语音在第一行出现后同步开始
    const voiceTimer = setTimeout(() => voice.bindRise(), 200)
    // 全部展示完后跳转
    const doneTimer  = setTimeout(() => updateState({ phase: 'starmap', system: 'rise' }), DONE_DELAY)
    return () => {
      lineTimers.forEach(clearTimeout)
      clearTimeout(voiceTimer)
      clearTimeout(doneTimer)
    }
  }, [bound])

  if (bound) {
    return (
      <div className="binding-screen fade-in">
        <div className="binding-glow" />
        <div className="binding-scan-sweep" />
        <div className="binding-frame">
          <span className="bc bc-tl" /><span className="bc bc-tr" />
          <span className="bc bc-bl" /><span className="bc bc-br" />

          {BINDING_LINES.map((line, i) =>
            shown.includes(i) && (
              <p
                key={i}
                className={`binding-entry ${i === 2 ? 'binding-system-name' : 'binding-line'}`}
              >
                {line}
              </p>
            )
          )}

          <div className="binding-progress">
            {BINDING_LINES.map((_, i) => (
              <span key={i} className={`binding-dot ${shown.includes(i) ? 'active' : ''}`} />
            ))}
          </div>
        </div>
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
              setBound(true)
            }}
          >
            ⚡ 绑定《爽文女主觉醒系统》
          </button>
        </div>
      </div>
    </div>
  )
}

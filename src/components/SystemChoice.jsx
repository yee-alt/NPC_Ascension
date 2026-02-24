import { useState, useEffect } from 'react'
import { sfx, speakLine, cancelSpeak } from '../sound'

// 每行：视觉文本 + 对应语音短句（各自独立播报，完全同步）
const BINDING_LINES = [
  { text: '恭喜宿主拒绝平庸命运。',  say: '恭喜宿主，拒绝平庸命运。' },
  { text: '正在绑定 ——',             say: '正在绑定——' },
  { text: '《爽文女主觉醒系统》',      say: '爽文女主觉醒系统。' },
  { text: '觉醒路径已开启。',         say: '觉醒之路，已开启。' },
  { text: '第一阶段任务生成中……',     say: '第一阶段任务，生成中。' },
]

// 每行出现时机（ms）— 给前一行语音留足播放时间，文字与声音真正同步
const LINE_DELAYS = [100, 2400, 3800, 5400, 7000]
const DONE_DELAY  = 9000

const VOICE_OPTS = { pitch: 0.65, rate: 0.80 }

export default function SystemChoice({ state, updateState }) {
  const [bound, setBound] = useState(false)
  const [shown, setShown] = useState([])

  useEffect(() => {
    if (!bound) return
    // 每行出现时同时触发对应短句语音（加入队列，不打断）
    const lineTimers = LINE_DELAYS.map((delay, i) =>
      setTimeout(() => {
        setShown(s => [...s, i])
        speakLine(BINDING_LINES[i].say, VOICE_OPTS)
      }, delay)
    )
    const doneTimer = setTimeout(() => updateState({ phase: 'starmap', system: 'rise' }), DONE_DELAY)
    return () => {
      lineTimers.forEach(clearTimeout)
      clearTimeout(doneTimer)
      cancelSpeak()
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
                {line.text}
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

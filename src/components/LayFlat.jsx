import { useState, useEffect } from 'react'
import { voice } from '../sound'

const EVENTS = [
  { delay: 1200, text: '今日已自动完成打工 ···  工资 +200' },
  { delay: 2800, text: '明日预测：重复今天   ···  工资 +200' },
  { delay: 4400, text: '本周预测：重复本月   ···  工资 +200' },
]

export default function LayFlat({ updateState }) {
  const [visible, setVisible] = useState([])
  const [showQ,   setShowQ]   = useState(false)

  useEffect(() => {
    const timers = EVENTS.map((ev, i) =>
      setTimeout(() => setVisible(v => [...v, i]), ev.delay)
    )
    const tq = setTimeout(() => {
      setShowQ(true)
      setTimeout(() => voice.layflat(), 500)
    }, 6000)
    return () => { timers.forEach(clearTimeout); clearTimeout(tq) }
  }, [])

  return (
    <div className="layflat-page">
      <div className="layflat-content fade-in">
        <h2 className="layflat-title">咸鱼躺平系统</h2>

        <div className="layflat-events">
          {EVENTS.map((ev, i) =>
            visible.includes(i) && (
              <div key={i} className="layflat-event fade-in">
                {ev.text}
              </div>
            )
          )}
        </div>

        {showQ && (
          <div className="layflat-question fade-in">
            <p>你甘心一生如此吗？</p>
            <button
              className="btn btn-primary"
              style={{ filter: 'saturate(5)' }}
              onClick={() => updateState({ phase: 'choice', system: null })}
            >
              重新选择命运 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

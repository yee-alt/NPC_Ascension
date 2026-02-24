import { useState, useEffect, useRef } from 'react'
import { SLOT_NAMES, DESTINY_MAP, FIXED_DRAW } from '../data/destiny'
import { sfx, voice } from '../sound'

const INTRO_LINES = [
  '正在扫描宿主命格……',
  '读取现实人生数据……',
  '分析当前阶层坐标……',
  '天命概率计算中……',
  '抽卡结果生成完毕。',
]

const RARITY_CONFIG = {
  npc:       { label: '低阶命格', color: '#888888', glow: 'rgba(136,136,136,0.4)' },
  rare:      { label: '稀有命格', color: '#b0b0e0', glow: 'rgba(160,160,220,0.5)' },
  legendary: { label: '传说命格', color: '#ffd700', glow: 'rgba(255,215,0,0.6)'   },
}

export default function CardDraw({ updateState }) {
  const [stage, setStage]         = useState('intro')
  const [introIdx, setIntroIdx]   = useState(0)
  const [slotName, setSlotName]   = useState('路人甲')
  const [showResult, setShowResult] = useState(false)
  const [lifeIdx, setLifeIdx]     = useState(0)
  const timerRef = useRef(null)

  const destiny = DESTINY_MAP[FIXED_DRAW]
  const rarity  = RARITY_CONFIG[destiny.rarity]

  // ── Intro typewriter ─────────────────────────────────────
  useEffect(() => {
    if (stage !== 'intro') return
    if (introIdx >= INTRO_LINES.length) {
      const t = setTimeout(() => setStage('spin'), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setIntroIdx(i => i + 1), 750)
    return () => clearTimeout(t)
  }, [stage, introIdx])

  // ── Slot spin: fast → slow → stop at '路人甲' ────────────
  useEffect(() => {
    if (stage !== 'spin') return
    let speed = 50
    let count = 0
    let idx   = 3

    const tick = () => {
      count++
      idx = (idx + 1) % SLOT_NAMES.length
      setSlotName(SLOT_NAMES[idx])
      if (count <= 22) sfx.slotTick()

      if (count > 18) speed = Math.min(speed + 20, 500)

      if (count > 28 && SLOT_NAMES[idx] === '路人甲') {
        clearTimeout(timerRef.current)
        setSlotName('路人甲')
        sfx.slotStop()
        setTimeout(() => {
          setStage('result')
          setTimeout(() => setShowResult(true), 300)
        }, 500)
        return
      }
      timerRef.current = setTimeout(tick, speed)
    }

    timerRef.current = setTimeout(tick, speed)
    return () => clearTimeout(timerRef.current)
  }, [stage])

  // ── Speak card result once when result appears ───────────
  useEffect(() => {
    if (!showResult) return
    const t = setTimeout(() => voice.cardResult(), 600)
    return () => clearTimeout(t)
  }, [showResult])

  // ── Life timeline: reveal one row at a time ──────────────
  useEffect(() => {
    if (!showResult || destiny.rarity !== 'npc') return
    if (lifeIdx >= destiny.life.length) return
    const t = setTimeout(() => setLifeIdx(i => i + 1), 200)
    return () => clearTimeout(t)
  }, [showResult, lifeIdx, destiny])

  // ── Intro stage ──────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <div className="draw-page">
        <div className="intro-lines">
          {INTRO_LINES.slice(0, introIdx).map((line, i) => (
            <div
              key={i}
              className="intro-line fade-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Spin stage ───────────────────────────────────────────
  if (stage === 'spin') {
    return (
      <div className="draw-page">
        <p className="draw-label">命格抽取中</p>

        <div className="slot-wrap">
          <div className="slot-cursor-l">▶</div>
          <div className="slot-machine">
            <div className="slot-glow-top" />
            <div className="slot-item">{slotName}</div>
            <div className="slot-glow-bot" />
          </div>
          <div className="slot-cursor-r">◀</div>
        </div>

        <div className="odds-row">
          <div className="odds-item">
            <span className="odds-dot npc" />
            <span>路人甲乙丙丁</span>
            <span className="odds-pct">95%</span>
          </div>
          <div className="odds-item">
            <span className="odds-dot rare" />
            <span>各类女配</span>
            <span className="odds-pct">4.9%</span>
          </div>
          <div className="odds-item">
            <span className="odds-dot legendary" />
            <span>爽文女主</span>
            <span className="odds-pct">0.1%</span>
          </div>
        </div>
      </div>
    )
  }

  // ── Result stage ─────────────────────────────────────────
  const allRevealed = destiny.rarity !== 'npc' || lifeIdx >= destiny.life.length

  return (
    <div className="draw-page">
      <div className={`result-box ${showResult ? 'fade-in' : 'invisible'}`}>

        {/* Rarity badge */}
        <div className="result-rarity" style={{ color: rarity.color, borderColor: rarity.color }}>
          ◈ &nbsp;{rarity.label}&nbsp; ◈
        </div>

        {/* Identity name */}
        <h1
          className="result-identity"
          style={{ color: rarity.color, textShadow: `0 0 30px ${rarity.glow}, 0 0 60px ${rarity.glow}` }}
        >
          {destiny.name}
        </h1>

        {/* Sub-tag */}
        <p className="result-tag" style={{ color: rarity.color }}>
          {destiny.tag}
        </p>

        {/* NPC: Life timeline */}
        {destiny.rarity === 'npc' && (
          <div className="life-timeline">
            <p className="life-title">── 一生轨迹预测 ──</p>
            <div className="life-list">
              {destiny.life.slice(0, lifeIdx).map((ev, i) => (
                <div
                  key={i}
                  className="life-row fade-in"
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  <span className="life-age">{ev.age}岁</span>
                  <span className="life-dot" />
                  <span className="life-text">{ev.text}</span>
                </div>
              ))}
            </div>
            {lifeIdx >= destiny.life.length && (
              <p className="result-prob fade-in">
                {destiny.prob}
              </p>
            )}
          </div>
        )}

        {/* Female support: description */}
        {destiny.rarity === 'rare' && (
          <div className="destiny-desc rare-desc fade-in">
            {destiny.desc.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Legendary */}
        {destiny.rarity === 'legendary' && (
          <div className="destiny-desc legendary-desc fade-in">
            {destiny.desc.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* CTA — only after all lines revealed */}
        {allRevealed && showResult && (
          <button
            className="btn btn-primary fade-in"
            onClick={() => updateState({ phase: 'choice', drawnDestiny: destiny.id })}
          >
            是否接受命运？→
          </button>
        )}
      </div>
    </div>
  )
}

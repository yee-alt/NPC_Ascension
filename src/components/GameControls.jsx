import { useState } from 'react'
import { isMuted, toggleMute } from '../sound'

/**
 * 固定在右上角的控制组：静音 + 重新开始
 * onReset：由 App 传入，负责清空状态
 */
export default function GameControls({ onReset }) {
  const [muted,    setMuted]    = useState(isMuted)
  const [confirm,  setConfirm]  = useState(false)

  const handleMute = () => {
    const next = toggleMute()
    setMuted(next)
  }

  const handleResetClick = () => {
    // 第一次点击：显示确认；第二次：真正重置
    if (confirm) {
      setConfirm(false)
      onReset()
    } else {
      setConfirm(true)
      // 3 秒后自动取消确认状态
      setTimeout(() => setConfirm(false), 3000)
    }
  }

  return (
    <div className="game-controls">
      {/* 重新开始 */}
      <button
        className={`ctrl-btn ${confirm ? 'ctrl-btn--confirm' : ''}`}
        onClick={handleResetClick}
        title={confirm ? '再次点击确认重置' : '重新开始'}
      >
        {confirm ? '确认?' : '↺'}
      </button>

      {/* 静音 */}
      <button
        className="ctrl-btn"
        onClick={handleMute}
        title={muted ? '开启音效' : '关闭音效'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

import { useState } from 'react'
import { isMuted, toggleMute } from '../sound'

export default function MuteButton() {
  const [muted, setMuted] = useState(isMuted)

  const handle = () => {
    const next = toggleMute()
    setMuted(next)
  }

  return (
    <button className="mute-btn" onClick={handle} title={muted ? '开启音效' : '关闭音效'}>
      {muted ? '🔇' : '🔊'}
    </button>
  )
}

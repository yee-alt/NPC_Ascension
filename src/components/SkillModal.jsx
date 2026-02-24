import { useState } from 'react'
import { sfx, voice } from '../sound'

export default function SkillModal({ skill, onUnlock, onClose }) {
  const [phase, setPhase] = useState('confirm') // confirm | video | reward

  if (phase === 'confirm') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-star-icon">✦</div>
          <p className="modal-label">是否点亮技能</p>
          <h2 className="modal-skill-name">【{skill.name}】</h2>
          <p className="modal-desc">{skill.desc}</p>
          <div className="modal-reward-tags">
            <div className="reward-tag">觉醒值 +1</div>
            <div className="reward-tag">认知 +2</div>
          </div>
          <div className="modal-buttons">
            <button className="btn btn-primary" onClick={() => setPhase('video')}>
              ✨ 确认点亮
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              放弃
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'video') {
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3 className="modal-skill-name" style={{ fontSize: 16 }}>
            【{skill.name}】
          </h3>
          <p className="video-hint">观看视频完成觉醒</p>

          {skill.videoUrl ? (
            <div className="video-frame">
              <iframe
                src={skill.videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={skill.name}
              />
            </div>
          ) : (
            <div className="video-placeholder">
              <div className="play-btn">▶</div>
              <p>视频即将上线</p>
            </div>
          )}

          <div className="modal-buttons">
            <button className="btn btn-primary" onClick={() => {
              sfx.starUnlock()
              setTimeout(() => voice.starUnlock(skill.name), 300)
              setPhase('reward')
            }}>
              ✅ 我已学会
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              稍后再看
            </button>
          </div>
        </div>
      </div>
    )
  }

  // reward phase
  return (
    <div className="modal-overlay">
      <div className="modal-card reward-card fade-in">
        <div className="reward-flash" />
        <p className="reward-ding">叮——</p>
        <p className="reward-msg">恭喜宿主突破认知上限</p>
        <div className="reward-values">
          <div className="reward-item">
            <span className="reward-num">+1</span>
            <span>觉醒值</span>
          </div>
          <div className="reward-item">
            <span className="reward-num">+2</span>
            <span>认知</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => onUnlock(skill.id)}>
          收下奖励 →
        </button>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { sfx, voice } from '../sound'

const SCAN_LINES = [
  '正在扫描宿主命格……',
  '读取现实人生数据……',
  '分析当前阶层坐标……',
  '命格计算中……',
  '抽卡概率生成完毕。',
]

export default function AvatarUpload({ state, updateState }) {
  const [preview, setPreview]   = useState(state.avatar || null)
  const [scanning, setScanning] = useState(false)
  const [scanIdx, setScanIdx]   = useState(0)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!scanning) return
    if (scanIdx >= SCAN_LINES.length) {
      const t = setTimeout(() => updateState({ phase: 'draw' }), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setScanIdx(i => i + 1), 700)
    return () => clearTimeout(t)
  }, [scanning, scanIdx])

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      updateState({ avatar: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const startScan = () => {
    sfx.scan()
    setTimeout(() => voice.scanStart(), 400)
    setScanning(true)
    setScanIdx(0)
  }

  if (scanning) {
    return (
      <div className="upload-page fade-in">
        <div className="scanning-box">
          {preview && <img src={preview} className="scan-avatar" alt="宿主" />}
          {!preview && <div className="scan-avatar-placeholder">✦</div>}
          <div className="scan-text" key={scanIdx}>
            {SCAN_LINES[scanIdx] ?? ''}
          </div>
          <div className="scan-bar">
            <div className="scan-fill" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-page fade-in">
      <div className="system-header">
        <div className="system-deco">✦ ✦ ✦</div>
        <h1 className="system-title gold-pulse">爽文女主觉醒系统</h1>
        <p className="system-subtitle">NPC觉醒系统 · 正式激活</p>
        <div className="system-deco-line" />
      </div>

      <div className="upload-card">
        <div className="avatar-frame" onClick={() => fileRef.current.click()}>
          {preview
            ? <img src={preview} className="avatar-img" alt="宿主" />
            : (
              <div className="avatar-placeholder">
                <div className="avatar-icon">◈</div>
                <p>上传宿主命格样本</p>
                <span>点击选择照片</span>
              </div>
            )
          }
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />

        <div className="upload-actions">
          <button className="btn btn-primary" onClick={startScan}>
            ⚡ 开始命格抽取
          </button>
          {!preview && (
            <button className="btn btn-ghost" onClick={startScan}>
              使用默认身份
            </button>
          )}
        </div>

        <p className="upload-hint">上传你的照片以获得专属命格体验</p>
      </div>
    </div>
  )
}

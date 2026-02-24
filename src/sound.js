// ─── NPC觉醒系统 · 音效引擎 ──────────────────────────────────
// Web Audio API → 生成音效（滴声/星星/升级）
// Web Speech API → 中文语音播报（机械女声）

let _ctx = null
let _muted = localStorage.getItem('npc_muted') === 'true'

// ─── 静音控制 ────────────────────────────────────────────────
export const isMuted   = ()  => _muted
export const toggleMute = () => {
  _muted = !_muted
  localStorage.setItem('npc_muted', String(_muted))
  if (_muted) window.speechSynthesis?.cancel()
  return _muted
}

// ─── AudioContext（首次用户交互后创建）─────────────────────────
const ctx = () => {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

// ─── 基础音符发生器 ──────────────────────────────────────────
const tone = (freq, dur, { type = 'sine', gain = 0.25, delay = 0 } = {}) => {
  if (_muted) return
  try {
    const c   = ctx()
    const osc = c.createOscillator()
    const g   = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.type            = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, c.currentTime + delay)
    g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur)
    osc.start(c.currentTime + delay)
    osc.stop(c.currentTime + delay + dur + 0.05)
  } catch {}
}

// ─── 音效库 ──────────────────────────────────────────────────
export const sfx = {
  /** 扫描嘀嘀声（开局） */
  scan () {
    [880, 0, 1100, 0, 880, 0, 1320].forEach((f, i) => {
      if (f) tone(f, 0.08, { type: 'square', gain: 0.12, delay: i * 0.18 })
    })
  },

  /** 老虎机滚动每一格滴声 */
  slotTick () {
    tone(600, 0.04, { type: 'square', gain: 0.08 })
  },

  /** 老虎机停止（三短一长） */
  slotStop () {
    tone(330, 0.1, { delay: 0   })
    tone(330, 0.1, { delay: 0.1 })
    tone(440, 0.4, { delay: 0.2 })
  },

  /** 点亮星星的清脆上扬音 */
  starUnlock () {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(f, 0.22, { type: 'sine', gain: 0.22, delay: i * 0.10 })
    )
  },

  /** 升级命格的史诗上扬和弦序列 */
  upgrade () {
    [262, 330, 392, 523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(f, 0.55, { type: 'sine', gain: 0.28, delay: i * 0.13 })
    )
  },

  /** 警告音（选择躺平） */
  warning () {
    [440, 330, 440, 330].forEach((f, i) =>
      tone(f, 0.15, { type: 'sawtooth', gain: 0.12, delay: i * 0.2 })
    )
  },

  /** 系统绑定成功短促上扬 */
  bind () {
    [440, 660, 880].forEach((f, i) =>
      tone(f, 0.18, { type: 'sine', gain: 0.22, delay: i * 0.12 })
    )
  },
}

// ─── 语音播报（Web Speech API）─────────────────────────────────
let _voiceReady = false
let _zhVoice    = null

const loadVoices = () => {
  const voices = window.speechSynthesis?.getVoices() ?? []
  // 优先找微软小晓/谷歌中文/任意zh-CN
  _zhVoice = (
    voices.find(v => v.name.includes('Xiaoxiao')) ||
    voices.find(v => v.name.includes('Xiaoyi'))   ||
    voices.find(v => v.name.includes('小'))        ||
    voices.find(v => v.lang === 'zh-CN')           ||
    voices.find(v => v.lang.startsWith('zh'))      ||
    null
  )
  _voiceReady = true
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices
  loadVoices()
}

/**
 * 朗读文本
 * @param {string} text
 * @param {{ rate?: number, pitch?: number, volume?: number }} opts
 */
export const speak = (text, opts = {}) => {
  if (_muted) return
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const u      = new SpeechSynthesisUtterance(text)
  u.lang       = 'zh-CN'
  u.rate       = opts.rate   ?? 0.82
  u.pitch      = opts.pitch  ?? 0.75   // 偏低音 → 机械冷酷感
  u.volume     = opts.volume ?? 0.95

  if (!_voiceReady) loadVoices()
  if (_zhVoice) u.voice = _zhVoice

  window.speechSynthesis.speak(u)
}

// ─── 预设播报台词 ─────────────────────────────────────────────
export const voice = {
  /** 扫描开始 */
  scanStart: () =>
    speak('正在扫描宿主命格……读取现实人生数据……'),

  /** 抽卡结果 */
  cardResult: () =>
    speak('检测到低阶命格。一生轨迹预测：普通上班，普通结婚，普通老去。爽文概率：零点一个百分点。', { rate: 0.8 }),

  /** 绑定逆袭系统 */
  bindRise: () =>
    speak('恭喜宿主，拒绝平庸命运。成功绑定——爽文女主觉醒系统。觉醒之路，已开启。', { pitch: 0.65, rate: 0.78 }),

  /** 绑定躺平系统 */
  bindLayflat: () =>
    speak('咸鱼躺平系统，已绑定。今日工资，自动结算完毕。', { pitch: 1.1, rate: 0.9 }),

  /** 躺平页发问 */
  layflat: () =>
    speak('你……真的甘心如此吗？', { pitch: 0.6, rate: 0.68 }),

  /** 点亮技能 */
  starUnlock: (skillName) =>
    speak(`叮——恭喜宿主突破认知上限。${skillName ?? ''}，已点亮。`, { rate: 0.85 }),

  /** 升级命格 */
  upgrade: (roleName) =>
    speak(`命格重塑完成。恭喜宿主突破凡人桎梏。当前身份：${roleName ?? '天命女配'}。`, { pitch: 0.62, rate: 0.75 }),

  /** 提示晋升进度 */
  progress: (remaining) =>
    speak(`距离晋升女配，还差${remaining}点觉醒值。`, { rate: 0.9 }),
}

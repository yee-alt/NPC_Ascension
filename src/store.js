const KEY = 'npc_ascension_v1'

export const DEFAULT_STATE = {
  phase: 'upload',     // upload | draw | choice | starmap | upgrade | layflat
  role: '路人甲',
  awakening: 0,
  cognition: 0,
  unlockedSkills: [],  // array of skill ids
  avatar: null,        // base64 string
  system: null,        // 'rise' | 'layflat'
  newRole: null,       // set during upgrade animation
}

export const getState = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    const saved = JSON.parse(raw)
    // 'upgrade' 是瞬态动画页面，不应从 localStorage 恢复
    // 否则刷新浏览器会看到白屏闪烁
    if (saved.phase === 'upgrade') saved.phase = 'starmap'
    return { ...DEFAULT_STATE, ...saved }
  } catch {
    return DEFAULT_STATE
  }
}

export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export const clearState = () => {
  localStorage.removeItem(KEY)
}

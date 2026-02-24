// ─── 古风金印 · 按钮点击特效 ─────────────────────────────────
// pointerdown 在点击 / 触摸位置注入：
//   1. 金色水墨扩散圆（ripple）
//   2. 六枚金粉粒子向四周飞散（dust）

let _ready = false

export function initRipple() {
  if (_ready) return
  _ready = true

  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn')
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // ── 水墨扩散圆 ──────────────────────────────────────────
    const ripple = document.createElement('span')
    ripple.className = 'btn-ripple'
    ripple.style.cssText = `left:${x}px;top:${y}px`
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true })

    // ── 金粉粒子 ────────────────────────────────────────────
    const count = 7
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 + (Math.random() - 0.5) * 45
      const dist  = 16 + Math.random() * 32
      const rad   = (angle * Math.PI) / 180
      const tx    = Math.cos(rad) * dist
      const ty    = Math.sin(rad) * dist
      const size  = 3 + Math.random() * 3          // 3–6 px

      const dust = document.createElement('span')
      dust.className = 'btn-dust'
      dust.style.cssText =
        `left:${x}px;top:${y}px;` +
        `--tx:${tx}px;--ty:${ty}px;` +
        `width:${size}px;height:${size}px;` +
        `animation-delay:${i * 0.018}s`
      btn.appendChild(dust)
      dust.addEventListener('animationend', () => dust.remove(), { once: true })
    }
  })
}

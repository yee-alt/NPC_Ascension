import { useState, useEffect } from 'react'
import { getState, saveState, clearState } from './store'
import { initRipple } from './ripple'
import AvatarUpload     from './components/AvatarUpload'
import CardDraw         from './components/CardDraw'
import SystemChoice     from './components/SystemChoice'
import StarMap          from './components/StarMap'
import UpgradeAnimation from './components/UpgradeAnimation'
import LayFlat          from './components/LayFlat'
import GameControls     from './components/GameControls'

export default function App() {
  const [state, setState] = useState(getState)

  useEffect(() => { initRipple() }, [])

  const updateState = (updates) => {
    setState(prev => {
      const next = { ...prev, ...updates }
      saveState(next)
      return next
    })
  }

  const resetGame = () => {
    clearState()
    setState(getState())
  }

  const { phase } = state

  return (
    <div className="app scanlines">
      <div className="stars-bg" />

      {phase === 'upload'  && <AvatarUpload    state={state} updateState={updateState} />}
      {phase === 'draw'    && <CardDraw         state={state} updateState={updateState} />}
      {phase === 'choice'  && <SystemChoice     state={state} updateState={updateState} />}
      {phase === 'starmap' && <StarMap          state={state} updateState={updateState} />}
      {phase === 'upgrade' && <UpgradeAnimation state={state} updateState={updateState} />}
      {phase === 'layflat' && <LayFlat          state={state} updateState={updateState} />}

      <GameControls onReset={resetGame} />
    </div>
  )
}

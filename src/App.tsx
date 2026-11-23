import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { LOGO_HEIGHT_VW, LogoIntro } from './components/LogoIntro'
import { ShimmerSweep } from './components/Shimmer'
import { RoomCodeScreen } from './screens/RoomCodeScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'

// Space between the logo and the screen content (Figma: 32px)
const LOGO_GAP = 32
// How long the tap shimmer plays before moving to the next screen
const SHIMMER_MS = 850

type Screen = 'intro' | 'welcome' | 'room'

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [shineCount, setShineCount] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  // The logo stays put across screens; slide it up so logo + content sit centred
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setContentHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const logoOffset = contentHeight ? -(LOGO_GAP + contentHeight) / 2 : 0

  const start = () => {
    setShineCount((n) => n + 1)
    setTimeout(() => setScreen('room'), SHIMMER_MS)
  }

  return (
    <main className="relative h-dvh overflow-hidden">
      <ShimmerSweep count={shineCount} />
      <LogoIntro offsetY={logoOffset} onDone={() => setScreen('welcome')} />

      <div className="safe-area pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {/* Holds the logo's place so the content lands just below it */}
        <div style={{ height: `${LOGO_HEIGHT_VW * 100}vw`, marginBottom: LOGO_GAP }} />
        <div ref={contentRef} className="pointer-events-auto w-[80vw]">
          <AnimatePresence mode="wait">
            {screen === 'welcome' && (
              <motion.div key="welcome" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                <WelcomeScreen shineCount={shineCount} onStart={start} />
              </motion.div>
            )}
            {screen === 'room' && (
              <motion.div key="room" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                <RoomCodeScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default App

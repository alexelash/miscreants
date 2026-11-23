import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { LOGO_HEIGHT_VW, LogoIntro } from './components/LogoIntro'
import { WelcomeScreen } from './screens/WelcomeScreen'

// Space between the logo and the content below it (Figma: 32px)
const LOGO_GAP = 32

/** The load intro and the welcome screen, which share the animated logo */
export function IntroStage({ onStart }: { onStart: (from: DOMRect) => void }) {
  const [introDone, setIntroDone] = useState(false)
  const [shineCount, setShineCount] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  // The logo slides up so logo + content sit centred together
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setContentHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const logoOffset = contentHeight ? -(LOGO_GAP + contentHeight) / 2 : 0

  return (
    <>
      <LogoIntro offsetY={logoOffset} onDone={() => setIntroDone(true)} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {/* Holds the logo's place so the content lands just below it */}
        <div style={{ height: `${LOGO_HEIGHT_VW * 100}vw`, marginBottom: LOGO_GAP }} />
        <div ref={contentRef} className="pointer-events-auto w-[80vw]">
          <AnimatePresence>
            {introDone && (
              <motion.div key="welcome">
                <WelcomeScreen
                  shineCount={shineCount}
                  onStart={(from) => {
                    setShineCount((n) => n + 1)
                    onStart(from)
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

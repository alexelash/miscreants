import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

// Brand-coloured light band, after jh3y's "Text Shimmer Lines" (codepen.io/jh3y/pen/Exqbaem):
// an angled gradient three times the element's width, clipped to the text, whose
// background-position slides from 100% to 0% so the band sweeps left to right.
const BAND = `var(--color-property-pink) 44%, var(--color-property-orange) 47%, var(--color-property-yellow) 50%, var(--color-property-blue-light) 54%`
const ANGLE = '110deg'

const gradients = {
  // Invisible -> band sweeps through -> solid ink left behind it
  reveal: (ink: string) => `linear-gradient(${ANGLE}, ${ink} 0 40%, ${BAND}, transparent 60%)`,
  // Solid ink with the band passing over it
  shine: (ink: string) => `linear-gradient(${ANGLE}, ${ink} 0 40%, ${BAND}, ${ink} 60%)`,
}

type ShimmerTextProps = {
  children: ReactNode
  /** Starts the reveal when it becomes true */
  revealed: boolean
  /** Increment to sweep the band across again */
  shineCount?: number
  ink?: string
  duration?: number
  delay?: number
  className?: string
}

export function ShimmerText({
  children,
  revealed,
  shineCount = 0,
  ink = 'var(--color-black)',
  duration = 1.2,
  delay = 0,
  className = '',
}: ShimmerTextProps) {
  const position = useMotionValue('100% 0')
  const [mode, setMode] = useState<keyof typeof gradients>('reveal')

  useEffect(() => {
    if (!revealed) return
    const controls = animate(position, ['100% 0', '0% 0'], { duration, delay, ease: 'easeInOut' })
    // Once revealed, swap to the shine gradient parked off to the right. Both
    // show solid ink at their resting positions, so the swap is invisible.
    controls.then(() => {
      setMode('shine')
      position.set('100% 0')
    })
    return () => controls.stop()
  }, [revealed, duration, delay, position])

  useEffect(() => {
    if (!shineCount) return
    const controls = animate(position, ['100% 0', '0% 0'], { duration: duration * 0.7, ease: 'easeInOut' })
    controls.then(() => position.set('100% 0'))
    return () => controls.stop()
  }, [shineCount, duration, position])

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradients[mode](ink),
        backgroundSize: '300% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: position,
        WebkitBackgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  )
}

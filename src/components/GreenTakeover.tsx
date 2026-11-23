import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'

type GreenTakeoverProps = {
  /** The tapped button's rect: its green grows from here */
  from: DOMRect
  /** Fires once green fills the screen, to swap the screen underneath */
  onCovered: () => void
  onDone: () => void
}

/** The button's green grows until it fills the screen, then fades to reveal the next screen */
export function GreenTakeover({ from, onCovered, onDone }: GreenTakeoverProps) {
  const left = useMotionValue(from.left)
  const top = useMotionValue(from.top)
  const width = useMotionValue(from.width)
  const height = useMotionValue(from.height)
  const radius = useMotionValue(from.height / 2)
  const opacity = useMotionValue(1)

  const callbacks = useRef({ onCovered, onDone })
  useEffect(() => {
    callbacks.current = { onCovered, onDone }
  })

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const grow = { duration: 0.6, ease: [0.65, 0, 0.35, 1] } as const
      animate(left, 0, grow)
      animate(top, 0, grow)
      animate(width, window.innerWidth, grow)
      animate(radius, 0, grow)
      await animate(height, window.innerHeight, grow)
      if (cancelled) return
      callbacks.current.onCovered()
      // Hold on full green for a beat, then let the next screen show through
      await animate(opacity, 0, { delay: 0.15, duration: 0.45, ease: 'easeOut' })
      if (!cancelled) callbacks.current.onDone()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [left, top, width, height, radius, opacity])

  return (
    <motion.div
      aria-hidden
      className="fixed z-50 bg-property-green"
      style={{ left, top, width, height, borderRadius: radius, opacity }}
    />
  )
}

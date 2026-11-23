import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'

// Figma "Screen 4": property-colour stripes at -43.35°
const ANGLE = -43.35

type StripeWipeProps = {
  /** The tapped button's rect: its green becomes the green stripe */
  from: DOMRect
  /** Fires once the screen is fully covered, to swap the screen underneath */
  onCovered: () => void
  onDone: () => void
}

/**
 * 1. The green button stretches and tilts into the green stripe while the red,
 *    light red and orange stripes slide in above it.
 * 2. The green stripe widens until it fills the screen.
 * 3. A background-coloured stripe sweeps across, and the next screen is under it.
 */
export function StripeWipe({ from, onCovered, onDone }: StripeWipeProps) {
  const w = window.innerWidth
  const h = window.innerHeight
  // Far enough to cover the screen from any anchor point
  const reach = Math.hypot(w, h) * 1.2
  const length = reach * 2
  const stripe = w * 0.42
  const cx = from.left + from.width / 2
  const cy = from.top + from.height / 2

  const greenRotate = useMotionValue(0)
  const greenWidth = useMotionValue(from.width)
  const greenHeight = useMotionValue(from.height)
  const greenRadius = useMotionValue(from.height / 2)
  const sweepY = useMotionValue(reach * 2)
  const stripeOffsets = [useMotionValue(-reach * 1.6), useMotionValue(-reach * 1.6), useMotionValue(-reach * 1.6)]

  const callbacks = useRef({ onCovered, onDone })
  useEffect(() => {
    callbacks.current = { onCovered, onDone }
  })

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const morph = { duration: 0.5, ease: [0.65, 0, 0.35, 1] } as const
      animate(greenRotate, ANGLE, morph)
      animate(greenWidth, length, morph)
      animate(greenHeight, stripe, morph)
      animate(greenRadius, 1, morph)
      // Orange, light red, then red slide in from the top-left
      stripeOffsets.forEach((offset, i) =>
        animate(offset, 0, { delay: 0.12 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }),
      )
      await new Promise((r) => setTimeout(r, 750))
      if (cancelled) return

      await animate(greenHeight, reach * 2, { duration: 0.45, ease: [0.65, 0, 0.35, 1] })
      if (cancelled) return

      await animate(sweepY, 0, { duration: 0.55, ease: [0.65, 0, 0.35, 1] })
      if (cancelled) return
      callbacks.current.onCovered()
      callbacks.current.onDone()
    }
    run()
    return () => {
      cancelled = true
    }
    // The wipe runs once per mount
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stripes above the green one, nearest first: orange, light red, red (red runs off the corner)
  const above = [
    { color: 'bg-property-orange', top: -1.5 * stripe, height: stripe },
    { color: 'bg-property-red-light', top: -2.5 * stripe, height: stripe },
    { color: 'bg-property-red', top: -2.5 * stripe - reach, height: reach },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-hidden>
      <div className="absolute" style={{ left: cx, top: cy, rotate: `${ANGLE}deg` }}>
        {above.map(({ color, top, height }, i) => (
          <motion.div
            key={color}
            className={`absolute ${color}`}
            style={{ left: -length / 2, top, width: length, height, y: stripeOffsets[i] }}
          />
        ))}
      </div>

      <motion.div className="absolute" style={{ left: cx, top: cy, rotate: greenRotate }}>
        <motion.div
          className="absolute bg-property-green"
          style={{
            width: greenWidth,
            height: greenHeight,
            borderRadius: greenRadius,
            x: '-50%',
            y: '-50%',
          }}
        />
      </motion.div>

      <div className="absolute" style={{ left: cx, top: cy, rotate: `${ANGLE}deg` }}>
        <motion.div
          className="absolute bg-board"
          style={{ left: -length / 2, top: -reach, width: length, height: reach * 2, y: sweepY }}
        />
      </div>
    </div>
  )
}

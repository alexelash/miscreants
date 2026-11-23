import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Badge, Letters, LOGO_VIEWBOX, MAN_O, Man, Tagline, WINK_BROW_D, WINK_EYE_D } from './logoParts'

// Logo width as a fraction of the viewport once the intro settles
const LOGO_WIDTH = 0.8

// Logo height as a fraction of the viewport width once settled
export const LOGO_HEIGHT_VW = LOGO_WIDTH * (LOGO_VIEWBOX.height / LOGO_VIEWBOX.width)

// Strong ease-in for each leg of the wink
const WINK_EASE = [0.6, 0, 0.9, 0.6] as const

/**
 * Load intro: starts inside Mr. Monopoly's O (the screen is all badge red),
 * zooms out to the full logo at 80vw, then he pops out of the O and winks.
 *
 * The zoom animates the SVG viewBox rather than a CSS scale, so the vectors
 * stay crisp at every frame instead of scaling up a rasterized layer.
 */
type LogoIntroProps = {
  onDone?: () => void
  /** Vertical offset in px to slide the settled logo by (negative is up) */
  offsetY?: number
}

export function LogoIntro({ onDone, offsetY = 0 }: LogoIntroProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  // Kept in a ref so a new callback identity doesn't restart the intro
  const onDoneRef = useRef(onDone)
  useLayoutEffect(() => {
    onDoneRef.current = onDone
  })
  const slideY = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  // 0 = inside the O, 1 = whole logo in view
  const zoom = useMotionValue(reduceMotion ? 1 : 0)

  const manY = useMotionValue(reduceMotion ? 0 : 140)
  const manScale = useMotionValue(reduceMotion ? 1 : 0.2)
  const manOpacity = useMotionValue(0)
  const eyeScaleY = useMotionValue(1)
  const browY = useMotionValue(0)

  const viewBox = useTransform(() => {
    // Read every motion value before any early return: useTransform only
    // subscribes to the values read on its first run
    const w = width.get()
    const h = height.get()
    const progress = zoom.get()
    if (!w || !h) return `0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`

    // Final framing: logo at LOGO_WIDTH of the viewport, centred
    const unitsPerPx = LOGO_VIEWBOX.width / (LOGO_WIDTH * w)
    const finalW = w * unitsPerPx
    const finalH = h * unitsPerPx
    const finalX = LOGO_VIEWBOX.width / 2 - finalW / 2
    const finalY = LOGO_VIEWBOX.height / 2 - finalH / 2

    // Start zoomed in far enough that the O's inner hole covers every corner
    const oScreenX = (MAN_O.x - finalX) / unitsPerPx
    const oScreenY = (MAN_O.y - finalY) / unitsPerPx
    const farthestCornerPx = Math.hypot(Math.max(oScreenX, w - oScreenX), Math.max(oScreenY, h - oScreenY))
    const startScale = (farthestCornerPx * unitsPerPx * 1.1) / MAN_O.innerRadius

    // Zoom exponentially about the O's centre, so it feels like constant speed
    const scale = Math.pow(startScale, 1 - progress)
    const x = MAN_O.x - (MAN_O.x - finalX) / scale
    const y = MAN_O.y - (MAN_O.y - finalY) / scale
    return `${x} ${y} ${finalW / scale} ${finalH / scale}`
  })

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const measure = () => {
      width.set(svg.clientWidth)
      height.set(svg.clientHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    return () => observer.disconnect()
  }, [width, height])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!reduceMotion) {
        await animate(zoom, 1, { delay: 0.6, duration: 2.6, ease: [0.7, 0, 0.15, 1] })
      }
      if (cancelled) return

      // Pop up out of the O, with a small overshoot
      animate(manOpacity, 1, { duration: 0.15 })
      animate(manScale, 1, { type: 'spring', stiffness: 380, damping: 22 })
      await animate(manY, 0, { type: 'spring', stiffness: 380, damping: 24 })
      if (cancelled) return

      // Wink: each leg eases in (slow start, quick end)
      await new Promise((resolve) => setTimeout(resolve, 150))
      if (cancelled) return
      const wink = { duration: 0.36, times: [0, 0.4, 0.6, 1], ease: WINK_EASE }
      animate(browY, [0, 4, 4, 0], wink)
      await animate(eyeScaleY, [1, 0.1, 0.1, 1], wink)
      if (!cancelled) onDoneRef.current?.()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [reduceMotion, zoom, manOpacity, manScale, manY, eyeScaleY, browY])

  useEffect(() => {
    const controls = animate(slideY, offsetY, { type: 'spring', stiffness: 170, damping: 26 })
    return () => controls.stop()
  }, [offsetY, slideY])

  return (
    <motion.svg
      ref={ref}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      style={{ y: slideY }}
      className="absolute inset-0 size-full"
      role="img"
      aria-label="Monopoly"
    >
      {Tagline}
      {Badge}
      {Letters}
      <motion.g
        style={{
          y: manY,
          scale: manScale,
          opacity: manOpacity,
          // Grow from the bottom of the O
          transformBox: 'fill-box',
          transformOrigin: '50% 100%',
        }}
      >
        {Man}
        <motion.path d={WINK_BROW_D} style={{ y: browY }} />
        <motion.path
          d={WINK_EYE_D}
          style={{ scaleY: eyeScaleY, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      </motion.g>
    </motion.svg>
  )
}

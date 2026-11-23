import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import chanceCard from '../assets/chance-card.svg'
import communityChest from '../assets/community-chest.svg'
import board from '../assets/monopoly-game-board.svg'
import { PillButton, TextButton } from '../components/PillButton'
import { ScreenHeading } from '../components/ScreenLayout'

// The dashed card slots on monopoly-game-board.svg, as fractions of the board
// size. Both sit on the -45° diagonal, like the MONOPOLY banner.
const SLOTS = {
  communityChest: { x: 0.297, y: 0.296 },
  chance: { x: 0.703, y: 0.703 },
}
const CARD_WIDTH = 0.188
const CARD_ANGLE = -45
// One loop: slide in, sit in the slot, slide back out
const CARD_LOOP = { duration: 3.4, times: [0, 0.22, 0.82, 1], repeat: Infinity, repeatDelay: 0.4 }

// Figma "Screen 10" (node 2312:68821)
export function BoardSetupScreen({ onNext }: { onNext: () => void }) {
  const reduceMotion = useReducedMotion()
  const slotRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)
  const [spun, setSpun] = useState(false)
  const settled = spun || !!reduceMotion
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const opacity = useMotionValue(0)

  useLayoutEffect(() => {
    const el = slotRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setSize(Math.min(el.clientWidth, el.clientHeight)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = slotRef.current
    if (!el || !size) return
    if (reduceMotion) {
      opacity.set(1)
      return
    }
    let cancelled = false
    const run = async () => {
      // Start in the middle of the screen, a touch larger than the slot
      const rect = el.getBoundingClientRect()
      x.set(window.innerWidth / 2 - (rect.left + rect.width / 2))
      y.set(window.innerHeight / 2 - (rect.top + rect.height / 2))
      scale.set(1.12)
      animate(opacity, 1, { duration: 0.3 })
      // Spin once
      await animate(rotate, 360, { duration: 1.3, ease: [0.65, 0, 0.35, 1] })
      if (cancelled) return
      // Slide into place while the text and buttons come in
      setSpun(true)
      const settle = { type: 'spring', stiffness: 160, damping: 22 } as const
      animate(x, 0, settle)
      animate(y, 0, settle)
      animate(scale, 1, settle)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [size, reduceMotion, x, y, scale, rotate, opacity])

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { delay, type: 'spring' as const, stiffness: 300, damping: 26 },
  })

  return (
    <div className="flex h-full flex-col gap-6 px-6 pt-[84px] pb-6">
      <motion.div {...appear(0.1)}>
        {settled && (
          <ScreenHeading title="Set up the board" className="pb-0">
            <p>
              Place the board on a table and put the Chance and Community Chest cards facedown on their allotted
              spaces on the board.
            </p>
          </ScreenHeading>
        )}
      </motion.div>

      <div ref={slotRef} className="flex min-h-0 flex-1 items-center justify-center">
        {size > 0 && (
          <motion.div className="relative" style={{ width: size, height: size, x, y, scale, rotate, opacity }}>
            <img src={board} alt="Monopoly board" className="size-full drop-shadow-[0_6px_16px_rgba(15,22,30,0.18)]" />
            {settled && !reduceMotion && (
              <>
                <Card src={communityChest} alt="Community Chest cards" size={size} slot={SLOTS.communityChest} from={-1} />
                <Card src={chanceCard} alt="Chance cards" size={size} slot={SLOTS.chance} from={1} />
              </>
            )}
          </motion.div>
        )}
      </div>

      <motion.div className="flex flex-col" {...appear(0.25)}>
        <PillButton onClick={onNext}>Next: Starting money</PillButton>
        <TextButton className="no-underline" onClick={onNext}>
          Skip, it’s set up already
        </TextButton>
      </motion.div>
    </div>
  )
}

/** A card deck that slides in from one side of the screen into its slot, on a loop */
function Card({
  src,
  alt,
  size,
  slot,
  from,
}: {
  src: string
  alt: string
  size: number
  slot: { x: number; y: number }
  /** -1 slides in from the left, 1 from the right */
  from: -1 | 1
}) {
  const width = size * CARD_WIDTH
  const offscreen = from * window.innerWidth
  return (
    <motion.img
      src={src}
      alt={alt}
      className="absolute max-w-none drop-shadow-[0_3px_6px_rgba(15,22,30,0.25)]"
      style={{ width, left: slot.x * size - width / 2, top: slot.y * size - (width * 157) / 244 / 2 }}
      initial={{ x: offscreen, rotate: CARD_ANGLE + from * 30 }}
      animate={{
        x: [offscreen, 0, 0, offscreen],
        rotate: [CARD_ANGLE + from * 30, CARD_ANGLE, CARD_ANGLE, CARD_ANGLE - from * 30],
      }}
      transition={{ ...CARD_LOOP, ease: ['easeOut', 'linear', 'easeIn'], delay: from === 1 ? 0.25 : 0 }}
    />
  )
}

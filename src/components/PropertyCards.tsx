import { motion, useReducedMotion } from 'motion/react'
import chanceCard from '../assets/chance-card.svg'
import communityChest from '../assets/community-chest.svg'
import brown2 from '../assets/property-card-brown-2.svg'
import electricCompany from '../assets/property-card-electric-company.svg'
import green3 from '../assets/property-card-green-3.svg'
import pink1 from '../assets/property-card-pink-1.svg'
import station1 from '../assets/property-card-station-1.svg'
import waterWorks from '../assets/property-card-water-works.svg'

// Where each card lands, as fractions of the screen, clear of the centred
// content: three along the top edge and three along the bottom
const CARDS = [
  { src: brown2, x: 0.16, y: 0.09, rotate: -14 },
  { src: station1, x: 0.5, y: 0.02, rotate: 4 },
  { src: pink1, x: 0.85, y: 0.11, rotate: 12 },
  { src: green3, x: 0.14, y: 0.92, rotate: 10 },
  { src: electricCompany, x: 0.52, y: 1.0, rotate: -6 },
  { src: waterWorks, x: 0.87, y: 0.9, rotate: -13 },
]

// Chance and Community Chest (landscape cards) can take over the middle
// slots at the top and bottom, in place of Station 1 and Electric Company
const DECKS: Record<number, { src: string; x: number; y: number; rotate: number }> = {
  1: { src: communityChest, x: 0.5, y: 0.05, rotate: 5 },
  4: { src: chanceCard, x: 0.52, y: 0.96, rotate: -5 },
}

/**
 * Title deed cards that slide in from off-screen towards the middle and
 * settle around the edges, behind the screen's content
 */
export function PropertyCards({
  show = true,
  delay = 0,
  decks = false,
}: {
  show?: boolean
  delay?: number
  /** Swap in the Chance and Community Chest cards for two of the deeds */
  decks?: boolean
}) {
  const reduceMotion = useReducedMotion()
  if (!show) return null
  const cards = CARDS.map((card, i) =>
    decks && DECKS[i]
      ? { ...DECKS[i], width: 'w-[min(38vw,180px)]' }
      : { ...card, width: 'w-[min(30vw,140px)]' },
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {cards.map((card, i) => {
        // Start well outside the screen, along the line from the middle to the landing spot
        const dx = (card.x - 0.5) * 140
        const dy = (card.y - 0.5) * 140
        return (
          <motion.img
            key={card.src}
            src={card.src}
            alt=""
            className={`absolute ${card.width} max-w-none -translate-1/2 drop-shadow-[0_4px_10px_rgba(15,22,30,0.22)]`}
            style={{ left: `${card.x * 100}%`, top: `${card.y * 100}%` }}
            initial={reduceMotion ? false : { x: `${dx}vw`, y: `${dy}vh`, rotate: card.rotate * 3 }}
            animate={{ x: 0, y: 0, rotate: card.rotate }}
            transition={{ delay: delay + i * 0.07, type: 'spring', stiffness: 120, damping: 18 }}
          />
        )
      })}
    </div>
  )
}

import { motion } from 'motion/react'
import { PillButton } from '../components/PillButton'
import { ShimmerText } from '../components/Shimmer'

// Figma "Screen 2" (node 2308:23474), below the logo
export function WelcomeScreen({ shineCount, onStart }: { shineCount: number; onStart: (from: DOMRect) => void }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-center text-base leading-5 font-medium tracking-[0.024em]">
        <ShimmerText revealed delay={0.25} shineCount={shineCount}>
          Become a property mogul with a little help from Mr. Monopoly.
        </ShimmerText>
      </p>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, type: 'spring', stiffness: 300, damping: 26 }}
      >
        <PillButton color="green" onClick={(e) => onStart(e.currentTarget.getBoundingClientRect())}>
          Get started
        </PillButton>
      </motion.div>
    </div>
  )
}

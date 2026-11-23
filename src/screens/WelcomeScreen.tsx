import { motion } from 'motion/react'
import { ShimmerText } from '../components/Shimmer'
import { PillButton } from '../components/PillButton'

// Figma "Screen 2" (node 2308:23474), below the logo
export function WelcomeScreen({ shineCount, onStart }: { shineCount: number; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-center text-lg leading-5 font-medium tracking-[0.024em]">
        <ShimmerText revealed delay={0.25} shineCount={shineCount}>
          Become a property mogul.
        </ShimmerText>
      </p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, type: 'spring', stiffness: 300, damping: 26 }}
      >
        <PillButton onClick={onStart}>Get started</PillButton>
      </motion.div>
    </div>
  )
}

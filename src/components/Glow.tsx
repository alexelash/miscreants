import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Soft white glow behind its children: a 1:1 circle fading out to its edge.
 * The wrapper doesn't make its own stacking context, so the glow drops behind
 * everything on the screen (text included), not just behind the children.
 */
export function Glow({ size, className = '', children }: { size: string; className?: string; children: ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-20 aspect-square -translate-1/2 rounded-full bg-[radial-gradient(circle_closest-side,white,transparent)]"
        style={{ width: size }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </div>
  )
}

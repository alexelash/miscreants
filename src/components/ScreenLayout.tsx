import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ShimmerText } from './Shimmer'

/** Shared frame for the in-game screens: 24px padding, content stack, actions at the bottom */
export function ScreenLayout({
  children,
  actions,
  align = 'center',
}: {
  children: ReactNode
  actions?: ReactNode
  /** Figma centres the short screens and top-aligns the long ones */
  align?: 'center' | 'top'
}) {
  return (
    <div
      className={`flex h-full flex-col items-center gap-8 px-6 pb-6 ${
        align === 'center' ? 'justify-center pt-16' : 'pt-[84px]'
      }`}
    >
      <div className="flex w-full flex-col gap-2">{children}</div>
      {actions && (
        <motion.div
          className="flex w-full flex-col items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 26 }}
        >
          {actions}
        </motion.div>
      )}
    </div>
  )
}

// Figma "Title" pair: Kabel Bold 24 heading and Medium 14 body
export function ScreenHeading({ title, children, className = 'pb-10' }: { title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-2xl font-bold text-ink">
        <ShimmerText revealed ink="var(--color-ink)" duration={1}>
          {title}
        </ShimmerText>
      </h1>
      {children && (
        <motion.div
          className="flex flex-col gap-2 text-sm font-medium tracking-[0.024em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

const colors = {
  green: 'bg-property-green',
  blue: 'bg-property-blue-dark',
  red: 'bg-property-red',
}

// Figma "Button": brand pill, Kabel Demi 16px caps
export function PillButton({
  color = 'blue',
  className = '',
  children,
  ...props
}: HTMLMotionProps<'button'> & { color?: keyof typeof colors }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`shimmer-border flex h-[39px] w-full items-center justify-center rounded-full ${colors[color]} text-base leading-[1.25] font-semibold tracking-[0.1em] text-white uppercase transition-opacity disabled:opacity-40 ${className}`}
      {...props}
    >
      <span className="spark" />
      <span className="backdrop" />
      {children as ReactNode}
    </motion.button>
  )
}

// Figma secondary "Button": underlined text link
export function TextButton({ className = '', ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`w-full px-6 py-4 text-base leading-[1.25] font-medium text-ink underline underline-offset-2 ${className}`}
      {...props}
    />
  )
}

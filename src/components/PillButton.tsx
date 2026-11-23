import { motion, type HTMLMotionProps } from 'motion/react'

// Figma "Button": green pill, Kabel Demi 16px caps
export function PillButton({ className = '', ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      className={`flex h-[39px] w-[162px] items-center justify-center rounded-full bg-property-green text-base leading-[1.25] font-semibold tracking-[0.1em] text-white uppercase ${className}`}
      {...props}
    />
  )
}

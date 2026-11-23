import { motion } from 'motion/react'
import timesOut from '../assets/mr-monopoly-times-out.svg'
import { ScreenHeading } from '../components/ScreenLayout'

export function DoneScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 pt-16 pb-6 text-center">
      <ScreenHeading title="That’s all folks" className="items-center pb-0" />
      <motion.img
        src={timesOut}
        alt="Mr. Monopoly checking his pocket watch"
        className="w-[min(70vw,320px)]"
        initial={{ opacity: 0, y: 60, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 180, damping: 14 }}
      />
    </div>
  )
}

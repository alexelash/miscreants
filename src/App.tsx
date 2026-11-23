import { motion, useReducedMotion } from 'motion/react'
import { propertyColors, propertyColorVar } from './brand'
import { MonopolyLogo } from './components/MonopolyLogo'
import { usePreline } from './hooks/usePreline'

function App() {
  usePreline()
  const reduceMotion = useReducedMotion()

  return (
    <main className="safe-area flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <MonopolyLogo className="text-[clamp(2rem,11vw,4.5rem)]" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {propertyColors.map((color, i) => (
          <motion.div
            key={color}
            className="h-16 w-10 cursor-grab rounded-sm border-2 border-black shadow-level-1 active:cursor-grabbing"
            style={{ backgroundColor: propertyColorVar(color) }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
            drag
            dragSnapToOrigin
            whileDrag={{ scale: 1.15, rotate: 8, zIndex: 1 }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="type-board-large">Go to jail</p>
        <p className="type-board-medium">Community chest</p>
        <p className="type-board-small">Collect $200 salary as you pass</p>
      </div>

      {/* Preline dropdown, themed through the brand tokens in brand.css */}
      <div className="hs-dropdown relative inline-flex">
        <button
          id="hs-demo-dropdown"
          type="button"
          className="hs-dropdown-toggle type-board-small inline-flex items-center gap-x-2 rounded-full bg-primary px-5 py-3 text-primary-foreground hover:bg-primary-hover"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Menu"
        >
          Roll the dice
          <svg className="size-4 transition-transform hs-dropdown-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div
          className="hs-dropdown-menu hidden min-w-48 rounded-xl bg-white p-1 opacity-0 shadow-level-3 transition-[opacity,margin] hs-dropdown-open:opacity-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-demo-dropdown"
        >
          {['Buy property', 'Pay rent', 'Draw chance'].map((item) => (
            <a key={item} className="type-board-small block rounded-lg px-3 py-2 hover:bg-board" href="#">
              {item}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App

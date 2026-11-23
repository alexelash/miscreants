import { motion, useReducedMotion } from 'motion/react'
import { usePreline } from './hooks/usePreline'

function App() {
  usePreline()
  const reduceMotion = useReducedMotion()

  return (
    <main className="safe-area flex min-h-dvh flex-col items-center justify-center gap-10 bg-neutral-950 px-4 text-white">
      <motion.h1
        className="text-4xl font-bold tracking-tight"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        Miscreants
      </motion.h1>

      <motion.div
        className="size-32 cursor-grab rounded-3xl bg-linear-to-br from-fuchsia-500 to-orange-400 shadow-2xl active:cursor-grabbing"
        drag
        dragSnapToOrigin
        dragElastic={0.6}
        whileTap={{ scale: 0.92 }}
        whileDrag={{ scale: 1.08, rotate: 6 }}
      />

      <p className="text-sm text-neutral-400">Drag the square</p>

      {/* Preline dropdown: behavior comes from Preline's JS, styled with Tailwind */}
      <div className="hs-dropdown relative inline-flex">
        <button
          id="hs-demo-dropdown"
          type="button"
          className="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Menu"
        >
          Menu
          <svg className="size-4 hs-dropdown-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div
          className="hs-dropdown-menu hidden min-w-48 rounded-xl bg-white p-1 opacity-0 shadow-lg transition-[opacity,margin] hs-dropdown-open:opacity-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-demo-dropdown"
        >
          {['One', 'Two', 'Three'].map((item) => (
            <a key={item} className="block rounded-lg px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100" href="#">
              {item}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App

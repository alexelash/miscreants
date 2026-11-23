import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { PillButton } from '../components/PillButton'
import { ShimmerText } from '../components/Shimmer'

const CODE_LENGTH = 4

// Figma "Screen 3" (node 2308:23749), below the logo
export function RoomCodeScreen() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const setChar = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase()
    setCode((prev) => prev.map((c, i) => (i === index ? char : c)))
    if (char && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex w-full flex-col gap-2">
        <p className="text-[15px] leading-none font-semibold uppercase opacity-50">
          <ShimmerText revealed delay={0.1} duration={0.9}>
            Room code
          </ShimmerText>
        </p>
        <div className="flex gap-4 py-4">
          {code.map((char, i) => (
            <motion.input
              key={i}
              ref={(el) => {
                inputs.current[i] = el
              }}
              value={char}
              onChange={(e) => setChar(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !char && i > 0) inputs.current[i - 1]?.focus()
              }}
              aria-label={`Room code character ${i + 1}`}
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={2}
              className="h-14 min-w-0 flex-1 rounded-[4px] border border-[#0f161e]/35 bg-transparent text-center text-2xl font-semibold uppercase outline-none focus:border-property-blue-dark"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 26 }}
      >
        <PillButton>Get started</PillButton>
      </motion.div>
    </div>
  )
}

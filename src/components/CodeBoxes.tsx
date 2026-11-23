import { motion } from 'motion/react'
import { useRef } from 'react'
import { CODE_LENGTH } from '../game/room'

const box =
  'flex h-[58px] min-w-0 flex-1 items-center justify-center rounded-[4px] border border-black/20 bg-white text-center text-4xl leading-none font-semibold tracking-[0.1em] uppercase'

const Label = () => <p className="text-xs leading-none font-semibold uppercase opacity-50">Room code</p>

// Figma "Input / Code", read-only: the banker shows this to everyone
export function CodeDisplay({ code }: { code: string | null }) {
  return (
    <div className="flex w-full flex-col">
      <Label />
      <div className="flex gap-2 py-2">
        {Array.from({ length: CODE_LENGTH }, (_, i) => (
          <motion.div
            key={i}
            className={box}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
          >
            {code ? (
              <motion.span
                key={code[i]}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                {code[i]}
              </motion.span>
            ) : (
              <span className="size-3 animate-pulse rounded-full bg-black/15" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Figma "Input / Code", editable: everyone else types the banker's code
export function CodeInput({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const chars = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? '')

  const setChar = (index: number, raw: string) => {
    const typed = raw.toUpperCase().replace(/[^A-Z]/g, '')
    // Pasting the whole code into one box fills them all
    if (typed.length > 1) {
      onChange(typed.slice(0, CODE_LENGTH))
      inputs.current[Math.min(typed.length, CODE_LENGTH) - 1]?.focus()
      return
    }
    const next = chars.map((c, i) => (i === index ? typed : c)).join('')
    onChange(next)
    if (typed && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  return (
    <div className="flex w-full flex-col">
      <Label />
      <div className="flex gap-2 py-2">
        {chars.map((char, i) => (
          <motion.input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            value={char}
            disabled={disabled}
            onChange={(e) => setChar(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !char && i > 0) inputs.current[i - 1]?.focus()
            }}
            aria-label={`Room code letter ${i + 1}`}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            className={`${box} outline-none focus:border-property-blue-dark focus:ring-2 focus:ring-property-blue-dark/30 disabled:opacity-60`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
          />
        ))}
      </div>
    </div>
  )
}

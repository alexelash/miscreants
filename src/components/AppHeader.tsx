import { AnimatePresence, motion } from 'motion/react'
import { useRoom } from '../game/room'
import { PlayerAvatar } from './Avatars'
import { Badge, Letters, LOGO_VIEWBOX, Man, WINK_BROW_D, WINK_EYE_D } from './logoParts'

// The logo's viewBox cropped above the tagline
const MARK_HEIGHT = 446

// Same shapes as ui/home.svg and ui/back.svg, drawn in currentColor so the
// icons match the link text
const HomeIcon = () => (
  <svg viewBox="0 0 11 10" className="h-2.5 w-[11px]" aria-hidden>
    <path fill="currentColor" d="M1.5 10V5H0L5.5 0L7 1.36364V0.5H9V3.18182L9.5 3.63636L11 5H9.5V10H1.5Z" />
  </svg>
)
const BackIcon = () => (
  <svg viewBox="0 0 8.66667 8" className="h-2 w-[8.667px]" aria-hidden>
    <path fill="currentColor" d="M0 8V0H1.33333V8H0ZM8.66667 8L2.66667 4L8.66667 0V8Z" />
  </svg>
)

const link =
  'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs leading-none font-bold tracking-[0.1em] text-ink uppercase underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-property-blue-dark/40 focus-visible:outline-none'

/**
 * Top bar for the in-game screens, after Preline's flow header
 * (preline.co/blocks/navigation-layout/flow-headers): logo on the left,
 * Restart / Back links in the middle, your token on the right once picked
 */
export function AppHeader({
  onHome,
  onBack,
  showLinks = true,
}: {
  onHome: () => void
  onBack?: () => void
  /** Hide the links where the screen shows its own */
  showLinks?: boolean
}) {
  const { me, players } = useRoom()
  const myIndex = players.findIndex((p) => p.id === me?.id)

  return (
    <header className="absolute inset-x-0 top-[env(safe-area-inset-top)] z-50 border-b border-ink/10 bg-background/80 backdrop-blur-md">
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-x-2 px-[max(1.25rem,env(safe-area-inset-left))]">
        <svg
          viewBox={`0 0 ${LOGO_VIEWBOX.width} ${MARK_HEIGHT}`}
          className="h-6 w-auto justify-self-start"
          role="img"
          aria-label="Monopoly"
        >
          {Badge}
          {Letters}
          {Man}
          <path d={WINK_BROW_D} />
          <path d={WINK_EYE_D} />
        </svg>

        <nav className="flex items-center gap-x-1" aria-label="Game">
          {showLinks && (
            <>
              <button type="button" className={link} onClick={onHome}>
                <HomeIcon />
                Restart
              </button>
              {onBack && (
                <button type="button" className={link} onClick={onBack}>
                  <BackIcon />
                  Back
                </button>
              )}
            </>
          )}
        </nav>

        <div className="flex justify-end">
          <AnimatePresence>
            {me?.piece && (
              <motion.div
                key="me"
                className="origin-right scale-[0.82]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 0.82 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <PlayerAvatar player={me} index={Math.max(myIndex, 0)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

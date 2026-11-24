import { AnimatePresence, motion } from "motion/react";
import { useRoom } from "../game/room";
import { PlayerAvatar } from "./Avatars";
import {
  Badge,
  Letters,
  LOGO_VIEWBOX,
  Man,
  WINK_BROW_D,
  WINK_EYE_D,
} from "./logoParts";

// The logo's viewBox cropped above the tagline
const MARK_HEIGHT = 446;

// Same shapes as ui/home.svg and ui/back.svg, drawn in currentColor so the
// icons match the link text
const HomeIcon = () => (
  <svg
    viewBox="0 0 11 10"
    className="h-3 w-[13.2px]"
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M1.5 10V5H0L5.5 0L7 1.36364V0.5H9V3.18182L9.5 3.63636L11 5H9.5V10H1.5Z"
    />
  </svg>
);
const BackIcon = () => (
  <svg
    viewBox="0 0 8.66667 8"
    className="h-2.5 w-[10.83px]"
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M0 8V0H1.33333V8H0ZM8.66667 8L2.66667 4L8.66667 0V8Z"
    />
  </svg>
);

const link =
  "flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] leading-none font-bold tracking-[0.08em] text-ink uppercase transition-colors duration-150 hover:bg-ink/8 active:bg-ink/15 focus-visible:ring-2 focus-visible:ring-property-blue-dark/40 focus-visible:outline-none";

// Trim the line box to the capitals so they centre against the icons
// (Kabel's ascender space otherwise sits the caps high)
const label = "[text-box:trim-both_cap_alphabetic]";

/**
 * Top bar for the in-game screens, after Preline's flow header
 * (preline.co/blocks/navigation-layout/flow-headers): logo on the left,
 * Restart / Back links in the middle, your token on the right once picked
 * with the room's player count beside it
 */
export function AppHeader({
  onHome,
  onBack,
  showLinks = true,
}: {
  onHome: () => void;
  onBack?: () => void;
  /** Hide the links where the screen shows its own */
  showLinks?: boolean;
}) {
  const { me, players } = useRoom();
  const myIndex = players.findIndex((p) => p.id === me?.id);

  return (
    <header className="absolute inset-x-0 top-[env(safe-area-inset-top)] z-50 border-b border-ink/10 bg-white backdrop-blur-md">
      <div className="flex items-center justify-between gap-x-2 px-[max(1rem,env(safe-area-inset-left))]">
        {/* Equal flexible sides keep the links centred until space runs out.
            Under 400px wide the logo shrinks a step and the count drops its
            label so the 44px tap targets still fit. */}
        <div className="flex flex-1 basis-0">
          <svg
            viewBox={`0 0 ${LOGO_VIEWBOX.width} ${MARK_HEIGHT}`}
            className="mt-2 mb-4 h-7 w-auto shrink-0 min-[400px]:h-8"
            role="img"
            aria-label="Monopoly"
          >
            {Badge}
            {Letters}
            {Man}
            <path d={WINK_BROW_D} />
            <path d={WINK_EYE_D} />
          </svg>
        </div>

        <nav
          className="flex shrink-0 items-center gap-x-1"
          aria-label="Game"
        >
          {showLinks && (
            <>
              <button
                type="button"
                className={link}
                onClick={onHome}
              >
                <HomeIcon />
                <span className={label}>Restart</span>
              </button>
              {onBack && (
                <button
                  type="button"
                  className={link}
                  onClick={onBack}
                >
                  <BackIcon />
                  <span className={label}>Back</span>
                </button>
              )}
            </>
          )}
        </nav>

        <div className="flex flex-1 basis-0 items-center justify-end gap-1.5">
          <AnimatePresence>
            {me?.piece && (
              <motion.div
                key="me"
                // Scaled down from 44px; the negative margin gives back the space
                className="-ml-2 origin-right scale-[0.82]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 0.82 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <PlayerAvatar
                  player={me}
                  index={Math.max(myIndex, 0)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {players.length > 0 && (
            <motion.span
              key={players.length}
              className="flex flex-col items-center text-ink"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              aria-label={`${players.length} ${players.length === 1 ? "player" : "players"} in the room`}
            >
              <span className="text-base leading-none font-bold">
                {players.length}
              </span>
              <span className="text-[9px] leading-none font-bold tracking-[0.1em] uppercase max-[399px]:hidden">
                {players.length === 1 ? "player" : "players"}
              </span>
            </motion.span>
          )}
        </div>
      </div>
    </header>
  );
}

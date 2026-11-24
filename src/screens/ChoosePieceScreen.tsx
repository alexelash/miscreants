import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { PillButton } from "../components/PillButton";
import { ScreenHeading } from "../components/ScreenLayout";
import { playerFill, playerRing } from "../game/colors";
import { pieces } from "../game/pieces";
import { pieceOwners, useRoom } from "../game/room";

const COLUMNS = 3;
const ROWS = Math.ceil(pieces.length / COLUMNS);
const GAP = 10;

// Figma "Screen 9" (node 2310:66627). Three columns instead of two, and the
// tiles shrink to the space left, so every token and the Next button fit on
// any phone without scrolling.
export function ChoosePieceScreen({ onNext }: { onNext: () => void }) {
  const { players, me, pickPiece } = useRoom();
  const owners = pieceOwners(players);
  // If two players grab the same token at once, the earlier pick keeps it and
  // the other player's tile shows as taken, so they pick again
  const myPiece =
    me?.piece && owners.get(me.piece)?.id === me.id ? me.piece : null;

  const gridRef = useRef<HTMLDivElement>(null);
  const [tile, setTile] = useState(0);
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const byWidth = (el.clientWidth - GAP * (COLUMNS - 1)) / COLUMNS;
      const byHeight = (el.clientHeight - GAP * (ROWS - 1)) / ROWS;
      setTile(Math.max(0, Math.floor(Math.min(byWidth, byHeight, 110))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col gap-6 px-6 pt-[72px] pb-1">
      <ScreenHeading
        title="Choose your token"
        className="shrink-0 pb-0 text-center"
      >
        <p>
          Each player chooses one token to represent them while traveling around
          the board.
        </p>
      </ScreenHeading>

      <div
        ref={gridRef}
        className="flex min-h-0 flex-1 items-center justify-center"
      >
        {tile > 0 && (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${COLUMNS}, ${tile}px)`,
              gap: GAP,
            }}
          >
            {pieces.map((piece, i) => {
              const owner = owners.get(piece.id);
              const mine = !!owner && owner.id === me?.id;
              const takenByOther = !!owner && !mine;
              const ownerIndex =
                owner ? players.findIndex((p) => p.id === owner.id) : -1;
              return (
                <motion.button
                  key={piece.id}
                  type="button"
                  disabled={takenByOther}
                  onClick={() => pickPiece(piece.id)}
                  aria-label={`${piece.name}${takenByOther ? " (taken)" : ""}`}
                  aria-pressed={mine}
                  className={`relative rounded-lg border-[3px] bg-white ${owner ? playerRing(ownerIndex) : "border-transparent"}`}
                  style={{ width: tile, height: tile }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: takenByOther ? 0.45 : 1,
                    scale: mine ? 1.04 : 1,
                  }}
                  whileTap={{ scale: 0.94 }}
                  transition={{
                    delay: 0.1 + i * 0.025,
                    type: "spring",
                    stiffness: 350,
                    damping: 22,
                  }}
                >
                  <img
                    src={piece.src}
                    alt=""
                    className="size-full rounded-[5px] object-cover"
                  />
                  <AnimatePresence>
                    {owner && (
                      <motion.span
                        key={owner.id}
                        className={`absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-board text-white ${playerFill(ownerIndex)}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 18,
                        }}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="size-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M3.5 8.5l3 3 6-7" />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <motion.div
        className="shrink-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 26 }}
      >
        <PillButton
          onClick={onNext}
          disabled={!myPiece}
        >
          Next: Let’s begin
        </PillButton>
      </motion.div>
    </div>
  );
}

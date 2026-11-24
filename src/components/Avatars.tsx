import { AnimatePresence, motion } from "motion/react";
import questionMark from "../assets/ui/question-mark.svg";
import { pieceById } from "../game/pieces";
import { playerRing } from "../game/colors";
import type { Player } from "../game/room";

/** A player's token, or a question mark until they pick one */
export function PlayerAvatar({
  player,
  index,
}: {
  player: Player;
  index: number;
}) {
  const piece = pieceById(player.piece);
  return (
    <div
      className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${
        piece ?
          `bg-white ${playerRing(index)}`
        : "border-white bg-property-yellow"
      }`}
      title={piece ? piece.name : "Still choosing"}
    >
      <AnimatePresence
        mode="popLayout"
        initial={false}
      >
        {piece ?
          <motion.img
            key={piece.id}
            src={piece.src}
            alt={piece.name}
            className="size-full object-cover"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          />
        : <motion.img
            key="unknown"
            src={questionMark}
            alt="Still choosing"
            className="h-[54%]"
            exit={{ scale: 0.4, opacity: 0 }}
          />
        }
      </AnimatePresence>
    </div>
  );
}

// Figma "Avatar Group": overlapping avatars plus a count
export function PlayerGroup({ players }: { players: Player[] }) {
  if (players.length === 0) return null;
  return (
    <div className="flex items-center gap-[15px]">
      <div className="flex -space-x-[15px]">
        <AnimatePresence initial={false}>
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              <PlayerAvatar
                player={player}
                index={i}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="text-[15px] leading-tight font-medium tracking-[0.005em]">
        <motion.p
          key={players.length}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {players.length} {players.length === 1 ? "player" : "players joined"}
        </motion.p>
      </div>
    </div>
  );
}

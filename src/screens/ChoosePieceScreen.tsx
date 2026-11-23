import { motion } from 'motion/react'
import { playerRing } from '../game/colors'
import { PillButton } from '../components/PillButton'
import { ScreenHeading, ScreenLayout } from '../components/ScreenLayout'
import { pieces } from '../game/pieces'
import { pieceOwners, useRoom } from '../game/room'

// Figma "Screen 9" (node 2310:66627). Three columns instead of two so all the
// tokens fit on a phone screen without scrolling.
export function ChoosePieceScreen({ onNext }: { onNext: () => void }) {
  const { players, me, pickPiece } = useRoom()
  const owners = pieceOwners(players)
  // If two players grab the same token at once, the earlier pick keeps it and
  // the other player's tile shows as taken, so they pick again
  const myPiece = me?.piece && owners.get(me.piece)?.id === me.id ? me.piece : null

  return (
    <ScreenLayout align="top" actions={<PillButton onClick={onNext} disabled={!myPiece}>Next: Let’s begin</PillButton>}>
      <ScreenHeading title="Choose your token" className="pb-5">
        <p>Each player chooses one token to represent him or her while traveling around the board.</p>
      </ScreenHeading>
      <div className="grid grid-cols-3 gap-2.5 px-2">
        {pieces.map((piece, i) => {
          const owner = owners.get(piece.id)
          const mine = owner?.id === me?.id
          const takenByOther = owner && !mine
          const ownerIndex = owner ? players.findIndex((p) => p.id === owner.id) : -1
          return (
            <motion.button
              key={piece.id}
              type="button"
              disabled={takenByOther}
              onClick={() => pickPiece(piece.id)}
              aria-label={`${piece.name}${takenByOther ? ' (taken)' : ''}`}
              aria-pressed={mine}
              className={`relative aspect-square overflow-hidden rounded-lg border-[3px] bg-white transition-colors ${
                mine ? playerRing(ownerIndex) : 'border-transparent'
              } ${takenByOther ? 'opacity-35' : ''}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: takenByOther ? 0.35 : 1, scale: mine ? 1.04 : 1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ delay: 0.15 + i * 0.03, type: 'spring', stiffness: 350, damping: 22 }}
            >
              <img src={piece.src} alt="" className="size-full object-cover" />
              {takenByOther && (
                <span className={`absolute right-1 bottom-1 size-3 rounded-full border-2 bg-white ${playerRing(ownerIndex)}`} />
              )}
            </motion.button>
          )
        })}
      </div>
    </ScreenLayout>
  )
}

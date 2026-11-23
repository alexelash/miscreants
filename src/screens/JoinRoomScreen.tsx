import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PlayerGroup } from '../components/Avatars'
import { CodeInput } from '../components/CodeBoxes'
import { PillButton } from '../components/PillButton'
import { ScreenHeading, ScreenLayout } from '../components/ScreenLayout'
import { CODE_LENGTH, useRoom } from '../game/room'

// Figma "Screen 3" (node 2308:23749): everyone except the banker
export function JoinRoomScreen({ onNext }: { onNext: () => void }) {
  const { code, players, status, joinRoom, leaveRoom } = useRoom()
  // Until the player types, show the room this device is already in (it may
  // still be reconnecting after a refresh when this screen mounts)
  const [typedValue, setTyped] = useState<string | null>(null)
  const typed = typedValue ?? code ?? ''
  const joined = status === 'joined' && code === typed

  const onChange = (value: string) => {
    setTyped(value)
    if (status === 'joined') leaveRoom()
    if (value.length === CODE_LENGTH) joinRoom(value)
  }

  return (
    <ScreenLayout actions={<PillButton onClick={onNext} disabled={!joined}>Next: pick your piece</PillButton>}>
      <ScreenHeading title="Join your group">
        <p>Everyone in your group who needs some help should enter the same code on their own device.</p>
      </ScreenHeading>
      <CodeInput value={typed} onChange={onChange} disabled={status === 'connecting'} />
      <div className="min-h-11">
        <AnimatePresence mode="wait">
          {status === 'connecting' && (
            <motion.p key="connecting" className="text-sm opacity-60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}>
              Looking for that room…
            </motion.p>
          )}
          {status === 'not-found' && typed.length === CODE_LENGTH && (
            <motion.p
              key="missing"
              className="text-sm font-medium text-property-red"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: [8, -6, 4, 0] }}
              exit={{ opacity: 0 }}
            >
              No room with that code. Check the banker’s phone.
            </motion.p>
          )}
          {joined && (
            <motion.div key="players" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PlayerGroup players={players} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenLayout>
  )
}

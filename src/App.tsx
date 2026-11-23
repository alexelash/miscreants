import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { IntroStage } from './IntroStage'
import { NavChips } from './components/NavChips'
import { StripeWipe } from './components/StripeWipe'
import { useRoom } from './game/room'
import { loadSession, saveSession, type Screen } from './game/session'
import { BankerRoomScreen } from './screens/BankerRoomScreen'
import { BoardSetupScreen } from './screens/BoardSetupScreen'
import { ChooseBankerScreen } from './screens/ChooseBankerScreen'
import { ChoosePieceScreen } from './screens/ChoosePieceScreen'
import { DoneScreen } from './screens/DoneScreen'
import { JoinRoomScreen } from './screens/JoinRoomScreen'

// A device that was mid-game picks up where it left off instead of replaying the intro
const resumed = loadSession()

function App() {
  const room = useRoom()
  const [screen, setScreen] = useState<Screen>(resumed?.screen ?? 'intro')
  const [wipeFrom, setWipeFrom] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (resumed?.roomCode) room.rejoinRoom(resumed.roomCode)
    // Only on first load
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveSession(screen === 'intro' || screen === 'welcome' ? null : { screen, roomCode: room.code })
  }, [screen, room.code])

  const isBanker = room.me?.role === 'banker'
  const back: Partial<Record<Screen, Screen>> = {
    'choose-banker': 'welcome',
    'banker-room': 'choose-banker',
    'join-room': 'choose-banker',
    pieces: isBanker ? 'banker-room' : 'join-room',
    board: 'pieces',
    done: 'board',
  }

  const goHome = () => {
    room.leaveRoom()
    setScreen('welcome')
  }
  const goBack = () => {
    const to = back[screen]
    if (!to) return
    // Backing out of the room screens leaves the room
    if (to === 'choose-banker') room.leaveRoom()
    setScreen(to)
  }

  const content = (() => {
    switch (screen) {
      case 'choose-banker':
        return (
          <ChooseBankerScreen
            onBanker={() => {
              room.createRoom()
              setScreen('banker-room')
            }}
            onPlayer={() => setScreen('join-room')}
          />
        )
      case 'banker-room':
        return <BankerRoomScreen onNext={() => setScreen('pieces')} />
      case 'join-room':
        return <JoinRoomScreen onNext={() => setScreen('pieces')} />
      case 'pieces':
        return <ChoosePieceScreen onNext={() => setScreen('board')} />
      case 'board':
        return <BoardSetupScreen onNext={() => setScreen('done')} />
      case 'done':
        return <DoneScreen />
      default:
        return null
    }
  })()

  return (
    <main className="safe-area relative h-dvh overflow-hidden">
      {screen === 'intro' || screen === 'welcome' ? (
        <IntroStage onStart={setWipeFrom} />
      ) : (
        <>
          <NavChips onHome={goHome} onBack={back[screen] ? goBack : undefined} />
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              className="h-full"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {wipeFrom && (
        <StripeWipe from={wipeFrom} onCovered={() => setScreen('choose-banker')} onDone={() => setWipeFrom(null)} />
      )}
    </main>
  )
}

export default App

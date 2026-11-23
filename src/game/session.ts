// What this device remembers between visits, so a judge who refreshes or
// locks their phone lands back where they were.

export type Screen = 'intro' | 'welcome' | 'choose-banker' | 'banker-room' | 'join-room' | 'pieces' | 'board' | 'done'

export type Session = {
  roomCode: string | null
  screen: Screen
}

const PLAYER_ID_KEY = 'miscreants.playerId'
const SESSION_KEY = 'miscreants.session'

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Private mode or storage blocked: the app still works, it just won't resume
  }
}

export function getPlayerId() {
  let id = read(PLAYER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    write(PLAYER_ID_KEY, id)
  }
  return id
}

export function loadSession(): Session | null {
  try {
    const raw = read(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session | null) {
  write(SESSION_KEY, session ? JSON.stringify(session) : null)
}

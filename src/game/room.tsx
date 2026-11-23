import mqtt, { type MqttClient } from 'mqtt'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { PieceId } from './pieces'
import { getPlayerId } from './session'

/*
 * Multiplayer rooms over a public MQTT broker, so the static site needs no backend.
 * Each device publishes its own player record as a *retained* message under the
 * room's topic; the broker hands every retained record to anyone who subscribes,
 * so late joiners and refreshed phones see the whole room straight away.
 *
 * Public broker = anyone who guesses a topic can read it. Fine for a demo.
 */
const BROKER_URL = import.meta.env.VITE_MQTT_URL ?? 'wss://broker.hivemq.com:8884/mqtt'
const TOPIC_ROOT = 'miscreants-monopoly/v1/rooms'
// How long to wait for a room's retained record before deciding it doesn't exist
const LOOKUP_TIMEOUT_MS = 3000

// No I or O, so codes can't be misread as 1 or 0
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
export const CODE_LENGTH = 4

export type Role = 'banker' | 'player'

export type Player = {
  id: string
  role: Role
  joinedAt: number
  piece: PieceId | null
  pickedAt: number | null
}

type RoomStatus = 'idle' | 'connecting' | 'joined' | 'not-found' | 'error'

type RoomContextValue = {
  status: RoomStatus
  code: string | null
  players: Player[]
  me: Player | null
  createRoom: () => string
  joinRoom: (code: string) => Promise<boolean>
  rejoinRoom: (code: string) => Promise<boolean>
  pickPiece: (piece: PieceId) => void
  leaveRoom: () => void
}

const RoomContext = createContext<RoomContextValue | null>(null)

const roomTopic = (code: string) => `${TOPIC_ROOT}/${code}`
const metaTopic = (code: string) => `${roomTopic(code)}/meta`
const playerTopic = (code: string, id: string) => `${roomTopic(code)}/players/${id}`

const randomCode = () =>
  Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('')

export function RoomProvider({ children }: { children: ReactNode }) {
  const playerId = useMemo(() => getPlayerId(), [])
  const clientRef = useRef<MqttClient | null>(null)
  const meRef = useRef<Player | null>(null)
  const codeRef = useRef<string | null>(null)
  const [status, setStatus] = useState<RoomStatus>('idle')
  const [code, setCode] = useState<string | null>(null)
  const [playersById, setPlayersById] = useState<Record<string, Player>>({})

  const getClient = useCallback(() => {
    if (clientRef.current) return clientRef.current
    const client = mqtt.connect(BROKER_URL, { reconnectPeriod: 2000, connectTimeout: 10_000 })
    client.on('message', (topic, payload) => {
      const room = codeRef.current
      if (!room || !topic.startsWith(`${roomTopic(room)}/players/`)) return
      const id = topic.split('/').pop()!
      setPlayersById((prev) => {
        const next = { ...prev }
        if (payload.length === 0) delete next[id]
        else next[id] = JSON.parse(payload.toString()) as Player
        return next
      })
    })
    // After a dropped connection (phone locked, network blip), resubscribe and
    // republish our record in case the broker lost it
    client.on('connect', () => {
      const room = codeRef.current
      if (!room) return
      client.subscribe(`${roomTopic(room)}/players/+`, { qos: 1 })
      if (meRef.current) publishPlayer(client, room, meRef.current)
    })
    clientRef.current = client
    return client
  }, [])

  const whenConnected = useCallback(async () => {
    const client = getClient()
    if (client.connected) return client
    await new Promise<void>((resolve) => client.once('connect', () => resolve()))
    return client
  }, [getClient])

  // Resolves true if the room has a retained meta record
  const roomExists = useCallback(
    async (room: string) => {
      const client = await whenConnected()
      const topic = metaTopic(room)
      return new Promise<boolean>((resolve) => {
        const onMessage = (t: string, payload: Buffer) => {
          if (t !== topic || payload.length === 0) return
          done(true)
        }
        const timer = setTimeout(() => done(false), LOOKUP_TIMEOUT_MS)
        const done = (found: boolean) => {
          clearTimeout(timer)
          client.removeListener('message', onMessage)
          client.unsubscribe(topic)
          resolve(found)
        }
        client.on('message', onMessage)
        client.subscribe(topic, { qos: 1 })
      })
    },
    [whenConnected],
  )

  const enterRoom = useCallback(
    async (room: string, me: Player) => {
      // Show the room right away; the broker catches up once connected
      codeRef.current = room
      meRef.current = me
      setCode(room)
      setPlayersById({ [me.id]: me })
      const client = await whenConnected()
      if (codeRef.current !== room) return
      client.subscribe(`${roomTopic(room)}/players/+`, { qos: 1 })
      publishPlayer(client, room, me)
      setStatus('joined')
    },
    [whenConnected],
  )

  // The code is generated on the device so the banker sees it instantly. With
  // 24^4 (~330k) codes, a clash with a live room isn't worth a round trip.
  const createRoom = useCallback(() => {
    const room = randomCode()
    setStatus('connecting')
    enterRoom(room, { id: playerId, role: 'banker', joinedAt: Date.now(), piece: null, pickedAt: null })
    whenConnected().then((client) =>
      client.publish(metaTopic(room), JSON.stringify({ bankerId: playerId, createdAt: Date.now() }), {
        retain: true,
        qos: 1,
      }),
    )
    return room
  }, [whenConnected, enterRoom, playerId])

  const joinRoom = useCallback(
    async (room: string) => {
      setStatus('connecting')
      if (!(await roomExists(room))) {
        setStatus('not-found')
        return false
      }
      await enterRoom(room, { id: playerId, role: 'player', joinedAt: Date.now(), piece: null, pickedAt: null })
      return true
    },
    [roomExists, enterRoom, playerId],
  )

  // Coming back to a room this device was already in: keep our existing record
  const rejoinRoom = useCallback(
    async (room: string) => {
      setStatus('connecting')
      const client = await whenConnected()
      const existing = await new Promise<Player | null>((resolve) => {
        const topic = playerTopic(room, playerId)
        const onMessage = (t: string, payload: Buffer) => {
          if (t !== topic) return
          done(payload.length ? (JSON.parse(payload.toString()) as Player) : null)
        }
        const timer = setTimeout(() => done(null), LOOKUP_TIMEOUT_MS)
        const done = (player: Player | null) => {
          clearTimeout(timer)
          client.removeListener('message', onMessage)
          resolve(player)
        }
        client.on('message', onMessage)
        client.subscribe(topic, { qos: 1 })
      })
      if (!existing) {
        setStatus('not-found')
        return false
      }
      await enterRoom(room, existing)
      return true
    },
    [whenConnected, enterRoom, playerId],
  )

  const pickPiece = useCallback((piece: PieceId) => {
    const client = clientRef.current
    const room = codeRef.current
    if (!client || !room || !meRef.current) return
    const me = { ...meRef.current, piece, pickedAt: Date.now() }
    meRef.current = me
    setPlayersById((prev) => ({ ...prev, [me.id]: me }))
    publishPlayer(client, room, me)
  }, [])

  const leaveRoom = useCallback(() => {
    const client = clientRef.current
    const room = codeRef.current
    if (client && room) {
      // An empty retained message deletes our record for everyone
      client.publish(playerTopic(room, playerId), '', { retain: true, qos: 1 })
      client.unsubscribe(`${roomTopic(room)}/players/+`)
    }
    codeRef.current = null
    meRef.current = null
    setCode(null)
    setPlayersById({})
    setStatus('idle')
  }, [playerId])

  useEffect(() => () => void clientRef.current?.end(), [])

  const players = useMemo(() => Object.values(playersById).sort((a, b) => a.joinedAt - b.joinedAt), [playersById])

  const value = useMemo<RoomContextValue>(
    () => ({
      status,
      code,
      players,
      me: playersById[playerId] ?? null,
      createRoom,
      joinRoom,
      rejoinRoom,
      pickPiece,
      leaveRoom,
    }),
    [status, code, players, playersById, playerId, createRoom, joinRoom, rejoinRoom, pickPiece, leaveRoom],
  )

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

function publishPlayer(client: MqttClient, room: string, player: Player) {
  client.publish(playerTopic(room, player.id), JSON.stringify(player), { retain: true, qos: 1 })
}

export function useRoom() {
  const room = useContext(RoomContext)
  if (!room) throw new Error('useRoom must be used inside <RoomProvider>')
  return room
}

/** Who holds each piece. If two players grab the same one, the earlier pick wins. */
export function pieceOwners(players: Player[]) {
  const owners = new Map<PieceId, Player>()
  for (const p of players) {
    if (!p.piece) continue
    const current = owners.get(p.piece)
    if (!current || (p.pickedAt ?? 0) < (current.pickedAt ?? 0)) owners.set(p.piece, p)
  }
  return owners
}

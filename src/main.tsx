import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'preline'
import './index.css'
import App from './App.tsx'
import { RoomProvider } from './game/room'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoomProvider>
      <App />
    </RoomProvider>
  </StrictMode>,
)

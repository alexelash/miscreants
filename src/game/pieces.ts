import battleship from '../assets/pieces/battleship.png'
import boot from '../assets/pieces/boot.png'
import cannon from '../assets/pieces/cannon.png'
import horse from '../assets/pieces/horse.png'
import iron from '../assets/pieces/iron.png'
import moneyBag from '../assets/pieces/money-bag.png'
import raceCar from '../assets/pieces/race-car.png'
import scottieDog from '../assets/pieces/scottie-dog.png'
import thimble from '../assets/pieces/thimble.png'
import topHat from '../assets/pieces/top-hat.png'
import wheelbarrow from '../assets/pieces/wheelbarrow.png'

export const pieces = [
  { id: 'scottie-dog', name: 'Scottie dog', src: scottieDog },
  { id: 'race-car', name: 'Race car', src: raceCar },
  { id: 'iron', name: 'Iron', src: iron },
  { id: 'cannon', name: 'Cannon', src: cannon },
  { id: 'boot', name: 'Boot', src: boot },
  { id: 'battleship', name: 'Battleship', src: battleship },
  { id: 'horse', name: 'Horse and rider', src: horse },
  { id: 'thimble', name: 'Thimble', src: thimble },
  { id: 'top-hat', name: 'Top hat', src: topHat },
  { id: 'wheelbarrow', name: 'Wheelbarrow', src: wheelbarrow },
  { id: 'money-bag', name: 'Money bag', src: moneyBag },
] as const

export type PieceId = (typeof pieces)[number]['id']

export const pieceById = (id: string | null | undefined) => pieces.find((p) => p.id === id)

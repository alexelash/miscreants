// Each player gets a brand colour by join order (the light property colours
// are skipped because they disappear against white). Written out in full so
// Tailwind can find the class names.
const playerColors = [
  { ring: 'border-property-red', fill: 'bg-property-red' },
  { ring: 'border-property-blue-dark', fill: 'bg-property-blue-dark' },
  { ring: 'border-property-green', fill: 'bg-property-green' },
  { ring: 'border-property-orange', fill: 'bg-property-orange' },
  { ring: 'border-property-pink', fill: 'bg-property-pink' },
  { ring: 'border-property-brown', fill: 'bg-property-brown' },
]
const colorFor = (index: number) => playerColors[Math.max(index, 0) % playerColors.length]
export const playerRing = (index: number) => colorFor(index).ring
export const playerFill = (index: number) => colorFor(index).fill

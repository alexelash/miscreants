// Each player gets a brand colour by join order (the light property colours
// are skipped because they disappear against the white avatar)
const ringColors = [
  'border-property-red',
  'border-property-blue-dark',
  'border-property-green',
  'border-property-orange',
  'border-property-pink',
  'border-property-brown',
]
export const playerRing = (index: number) => ringColors[index % ringColors.length]

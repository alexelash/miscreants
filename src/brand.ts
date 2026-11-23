// Monopoly property colours, matching the --color-property-* tokens in brand.css.
// Use the token name in Tailwind classes (bg-property-red) and the CSS var in
// inline styles or Motion animations.
export const propertyColors = [
  'brown',
  'blue-light',
  'pink',
  'orange',
  'red',
  'yellow',
  'green',
  'blue-dark',
] as const

export type PropertyColor = (typeof propertyColors)[number]

export const propertyColorVar = (color: PropertyColor) =>
  `var(--color-property-${color})`

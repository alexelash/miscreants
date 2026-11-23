import { Badge, Letters, LOGO_VIEWBOX, Man, Tagline, WINK_BROW_D, WINK_EYE_D } from './logoParts'

// Static classic Monopoly logo. Size it with width classes; it keeps its aspect ratio.
export function MonopolyLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      className={className}
      role="img"
      aria-label="Monopoly"
    >
      {Tagline}
      {Badge}
      {Letters}
      {Man}
      <path d={WINK_BROW_D} />
      <path d={WINK_EYE_D} />
    </svg>
  )
}

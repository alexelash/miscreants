import mrMonopoly from '../assets/brand/mr-monopoly.png'
import mrMonopolyHand from '../assets/brand/mr-monopoly-hand.svg'
import mrMonopolyMask from '../assets/brand/mr-monopoly-mask.svg'
import { propertyColorVar, type PropertyColor } from '../brand'

type MonopolyLogoProps = {
  /** Replaces "MON", e.g. "CUSTOM" renders CUSTOMOPOLY */
  prefix?: string
  color?: PropertyColor
  /** Size the logo with a font-size class; everything scales in em */
  className?: string
}

// Figma "Monopoly Logo" component (node 392:3812). Designed at 148px type,
// so the px values from Figma are expressed here as em (px / 148).
export function MonopolyLogo({ prefix = 'MON', color = 'red', className = '' }: MonopolyLogoProps) {
  return (
    // Top padding reserves room for Mr. Monopoly, who sits above the box
    <div className={`relative inline-block pt-[0.9865em] ${className}`}>
      <div className="relative flex h-[0.892em] items-center">
        <div
          className="absolute inset-0 border-[0.054em] border-white"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 92.045%, rgba(0,0,0,0.08) 97.971%), linear-gradient(0deg, rgba(255,255,255,0) 85.606%, rgba(255,255,255,0.3) 96.33%), linear-gradient(90deg, rgba(255,255,255,0) 84.144%, rgba(255,255,255,0.2) 100%), linear-gradient(-55.49deg, rgba(255,255,255,0) 82.062%, rgba(255,255,255,0.12) 96.734%), linear-gradient(${propertyColorVar(color)}, ${propertyColorVar(color)})`,
          }}
        />
        <div className="relative flex h-full items-center border-[0.027em] border-black/20 px-[0.135em] font-board text-[1em] leading-[0.912em] font-semibold whitespace-nowrap text-white text-shadow-[-0.0405em_0.0405em_0.0338em_rgba(0,0,0,0.6)] [text-box:trim-both_cap_alphabetic]">
          <span className="uppercase">{prefix}</span>
          <span>OPOLY</span>
        </div>
        <div
          className="pointer-events-none absolute top-[-0.9865em] left-[calc(50%+0.1622em)] h-[1.2027em] w-[1.1216em] -translate-x-1/2 drop-shadow-[0_0_3px_rgba(0,0,0,0.06)]"
          aria-hidden
        >
          <div className="absolute inset-[77.53%_83.73%_0_-6.63%]">
            <img src={mrMonopolyHand} alt="" className="absolute inset-0 block size-full max-w-none" />
          </div>
          <div
            className="absolute inset-[-4.05%_-2.74%_-20.26%_-5.71%] mask-alpha mask-no-clip mask-no-repeat mask-intersect"
            style={{
              maskImage: `url("${mrMonopolyMask}")`,
              maskPosition: '0.064em 0.0488em',
              maskSize: '1.1216em 1.2027em',
            }}
          >
            <img src={mrMonopoly} alt="" className="absolute inset-0 size-full max-w-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

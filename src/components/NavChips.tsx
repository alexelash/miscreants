import backIcon from '../assets/ui/back.svg'
import homeIcon from '../assets/ui/home.svg'

const chip =
  'flex h-[22px] w-[61px] items-center justify-center gap-1.5 rounded-md bg-white/40 text-[9px] font-medium tracking-[0.024em] text-black'

// Figma "Buildings": HOME and BACK chips in the top-left corner
export function NavChips({ onHome, onBack }: { onHome: () => void; onBack?: () => void }) {
  return (
    <nav className="absolute top-[calc(env(safe-area-inset-top)+16px)] left-[calc(env(safe-area-inset-left)+18px)] z-10 flex gap-2.5">
      <button type="button" className={chip} onClick={onHome}>
        <img src={homeIcon} alt="" className="h-2.5 w-4" />
        HOME
      </button>
      {onBack && (
        <button type="button" className={chip} onClick={onBack}>
          <img src={backIcon} alt="" className="h-2 w-[13.667px]" />
          BACK
        </button>
      )}
    </nav>
  )
}

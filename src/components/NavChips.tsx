import backIcon from "../assets/ui/back.svg";
import homeIcon from "../assets/ui/home.svg";

const chip =
  "flex p-2 uppercase  items-center justify-center gap-1.5 rounded-md bg-white/40 text-sm font-bold leading-none tracking-[0.1em] text-black";

// Figma "Buildings": RESTART and BACK chips, pinned to the top-left corner
// unless placed inline in a screen's own layout
export function NavChips({
  onHome,
  onBack,
  inline = false,
}: {
  onHome: () => void;
  onBack?: () => void;
  inline?: boolean;
}) {
  const position = inline
    ? ""
    : "absolute top-[calc(env(safe-area-inset-top)+16px)] left-[calc(env(safe-area-inset-left)+18px)] z-10";
  return (
    <nav className={`${position} flex gap-2.5`}>
      <button
        type="button"
        className={chip}
        onClick={onHome}
      >
        <img
          src={homeIcon}
          className="w-6 h-auto"
        />
        Restart
      </button>
      {onBack && (
        <button
          type="button"
          className={chip}
          onClick={onBack}
        >
          <img
            src={backIcon}
            className="w-6 h-auto"
          />
          Back
        </button>
      )}
    </nav>
  );
}

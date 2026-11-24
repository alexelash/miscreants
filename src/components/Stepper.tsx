import { motion } from "motion/react";

/**
 * Wizard progress, after the step timeline in Preline's flow header: a row of
 * dots on a line, labels underneath. Steps before `current` show a check,
 * the current one is filled, the rest are hollow.
 */
export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  /** Zero-based index of the step we're on */
  current: number;
}) {
  // The line runs from the first dot's centre to the last's
  const inset = `${50 / steps.length}%`;
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <nav
      aria-label="Setup progress"
      className="relative"
    >
      <div
        aria-hidden
        className="absolute top-[7px] h-0.5 rounded-full bg-ink/15"
        style={{ left: inset, right: inset }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[7px] h-0.5 origin-left rounded-full bg-property-blue-dark"
        style={{ left: inset, right: inset }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <ol
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <motion.li
              key={step}
              className="relative flex flex-col items-center gap-2"
              aria-current={active ? "step" : undefined}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
            >
              <span className="relative flex size-4 items-center justify-center">
                {active && (
                  // Soft pulse so the current step reads at a glance
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-property-blue-dark/30"
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <span
                  className={`relative flex size-4 items-center justify-center rounded-full ring-4 ring-background ${
                    done || active
                      ? "bg-property-blue-dark text-white"
                      : "border-2 border-ink/25 bg-white"
                  }`}
                >
                  {done && (
                    <svg
                      viewBox="0 0 24 24"
                      className="size-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
              </span>
              <span
                className={`text-[11px] leading-none font-bold tracking-[0.08em] uppercase ${
                  active ? "text-ink" : "text-ink/50"
                }`}
              >
                <span className="sr-only">
                  Step {i + 1} of {steps.length}:{" "}
                </span>
                {step}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

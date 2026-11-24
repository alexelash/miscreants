import { motion } from "motion/react";
import timesOut from "../assets/mr-monopoly-times-out.svg";
import { Glow } from "../components/Glow";
import { NavChips } from "../components/NavChips";
import { PropertyCards } from "../components/PropertyCards";
import { ScreenHeading } from "../components/ScreenLayout";

export function DoneScreen({
  onHome,
  onBack,
}: {
  onHome: () => void;
  onBack: () => void;
}) {
  return (
    <div className="relative isolate flex h-full flex-col items-center justify-center gap-8 px-6 pt-16 pb-6 text-center">
      <PropertyCards delay={0.4} />
      <Glow size="min(80vw,360px)">
        <motion.img
          src={timesOut}
          alt="Mr. Monopoly checking his pocket watch"
          className="w-[min(30vw,320px)]"
          initial={{ opacity: 0, y: 60, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
        />
      </Glow>
      <ScreenHeading
        title="That’s all folks"
        className="items-center pb-0"
      >
        <p>
          This is as far as I got, unfortunately! I hope you enjoyed this little
          POC.
        </p>
      </ScreenHeading>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 26 }}
      >
        <NavChips inline onHome={onHome} onBack={onBack} />
      </motion.div>
    </div>
  );
}

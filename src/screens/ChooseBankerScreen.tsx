import { motion } from 'motion/react'
import bankerArt from '../assets/ui/banker.svg'
import { PillButton, TextButton } from '../components/PillButton'
import { ScreenHeading, ScreenLayout } from '../components/ScreenLayout'

// Figma "Screen 7" (node 2309:65491)
export function ChooseBankerScreen({ onBanker, onPlayer }: { onBanker: () => void; onPlayer: () => void }) {
  return (
    <ScreenLayout
      actions={
        <>
          <PillButton onClick={onBanker}>I’m the banker</PillButton>
          <TextButton onClick={onPlayer}>I’m a regular player</TextButton>
        </>
      }
    >
      <motion.img
        src={bankerArt}
        alt=""
        className="mb-6 h-[102px] w-[113px] self-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      />
      <ScreenHeading title="Choose your Banker">
        <p>
          Select as Banker a player who will also make a good Auctioneer. A Banker who plays in the game must keep
          his/her personal funds separate from those of the Bank.
        </p>
        <p>When more than five persons play, the Banker may elect to act only as Banker and Auctioneer.</p>
      </ScreenHeading>
    </ScreenLayout>
  )
}

import { PlayerGroup } from "../components/Avatars";
import { CodeDisplay } from "../components/CodeBoxes";
import { PillButton } from "../components/PillButton";
import { ScreenHeading, ScreenLayout } from "../components/ScreenLayout";
import { useRoom } from "../game/room";

// Figma "Screen 8" (node 2309:65548): only the banker sees this
export function BankerRoomScreen({ onNext }: { onNext: () => void }) {
  const { code, players, status } = useRoom();
  return (
    <ScreenLayout
      actions={<PillButton onClick={onNext}>Next: pick your piece</PillButton>}
    >
      <ScreenHeading title="Show this to the other players">
        <p>
          Show the code below to the other players who want to join the
          tutorial.
        </p>
      </ScreenHeading>
      {code && <CodeDisplay code={code} />}
      {status === "error" && (
        <p className="text-sm text-property-red">
          Couldn’t reach the game server. Retrying…
        </p>
      )}
      <PlayerGroup players={players} />
    </ScreenLayout>
  );
}

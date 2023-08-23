import { Status, useStore } from "../../store/store";
import Outcome from "./Outcome";
import Controls from "./Controls";
import HandsDisplay from "./HandsDisplay";

export default function GameUI() {
  const status = useStore((state) => state.status);
  const ifOutcome = status === Status.Win || status === Status.Push || status === Status.Loss || status === Status.Bust;

  return (
    <>
      {ifOutcome && <Outcome />}
      <HandsDisplay />
      <Controls />
    </>
  );
}

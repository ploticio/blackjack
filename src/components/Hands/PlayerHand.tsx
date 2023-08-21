import { useStore } from "../../store/store";
import HandComponent from "./HandComponent";
import HandSum from "./HandSum";

export default function PlayerHand() {
  const playerHand = useStore((state) => state.playerHand);
  const playerSum = useStore((state) => state.getPlayerSum);
  return (
    <>
      <h1>Player</h1>
      <HandComponent cards={playerHand} />
      <HandSum sum={playerSum()} />
    </>
  );
}

import { useStore } from "../../store/store";
import HandComponent from "./HandComponent";

export default function PlayerHand() {
  const playerHand = useStore((state) => state.playerHand);
  return (
    <>
      <h1>Player</h1>
      <HandComponent cards={playerHand} />
    </>
  );
}

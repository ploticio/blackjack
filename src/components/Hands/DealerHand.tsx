import { useSnapshot } from "valtio";
import { state } from "../../store/store";
import HandComponent from "./HandComponent";

export default function DealerHand() {
  const snapshot = useSnapshot(state);

  return (
    <>
      <h1>Dealer</h1>
      <HandComponent cards={snapshot.dealerHand.hand.cards} />
    </>
  );
}

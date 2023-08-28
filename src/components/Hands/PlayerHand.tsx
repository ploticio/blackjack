import "../../styles/PlayerHand.css";
import HandComponent from "./HandComponent";
import { state } from "../../store/store";
import { useSnapshot } from "valtio";

export default function PlayerHand() {
  const snapshot = useSnapshot(state);

  return (
    <div>
      <h1>Player</h1>
      <div className="hand-container">
        <HandComponent cards={snapshot.playerHand.hand.cards} status={snapshot.playerHand.hand.status} />
        {snapshot.splitHand.hand.cards.length > 0 && (
          <HandComponent cards={snapshot.splitHand.hand.cards} status={snapshot.splitHand.hand.status} />
        )}
      </div>
    </div>
  );
}

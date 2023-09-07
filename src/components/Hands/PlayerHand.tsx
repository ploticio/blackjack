import "../../styles/global.css";
import HandComponent from "./HandComponent";
import { state } from "../../store/store";
import { useSnapshot } from "valtio";
import { AnimationScope } from "framer-motion";

interface Props {
  playerScope: AnimationScope;
  splitScope: AnimationScope;
}

export default function PlayerHand({ playerScope, splitScope }: Props) {
  const snapshot = useSnapshot(state);

  return (
    <div>
      <div className="hand-container">
        <HandComponent
          cards={snapshot.playerHand.hand.cards}
          status={snapshot.playerHand.hand.status}
          sum={snapshot.playerHand.hand.getSum()}
          scope={playerScope}
        />
        {snapshot.splitHand.hand.cards.length > 0 && (
          <HandComponent
            cards={snapshot.splitHand.hand.cards}
            status={snapshot.splitHand.hand.status}
            sum={snapshot.splitHand.hand.getSum()}
            scope={splitScope}
          />
        )}
      </div>
    </div>
  );
}

import { useSnapshot } from "valtio";
import { state } from "../../store/store";
import HandComponent from "./HandComponent";
import { AnimationScope } from "framer-motion";

interface Props {
  renderDealerCardsAnimation: () => Promise<void>;
  scope: AnimationScope;
}

export default function DealerHand({ scope, renderDealerCardsAnimation }: Props) {
  const snapshot = useSnapshot(state);
  return (
    <>
      <HandComponent
        cards={snapshot.dealerHand.hand.cards}
        status={snapshot.dealerHand.hand.status}
        showStatus={false}
        sum={snapshot.dealerHand.hand.getSum()}
        scope={scope}
        renderDealerCardsAnimation={renderDealerCardsAnimation}
      />
    </>
  );
}

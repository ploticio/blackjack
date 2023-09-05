import { useSnapshot } from "valtio";
import { state } from "../../store/store";
import HandComponent from "./HandComponent";
import { AnimationScope } from "framer-motion";

interface Props {
  scope: AnimationScope;
}

export default function DealerHand({ scope }: Props) {
  const snapshot = useSnapshot(state);
  return (
    <>
      <HandComponent
        cards={snapshot.dealerHand.hand.cards}
        status={snapshot.dealerHand.hand.status}
        showStatus={false}
        sum={snapshot.dealerHand.hand.getSum()}
        scope={scope}
      />
    </>
  );
}

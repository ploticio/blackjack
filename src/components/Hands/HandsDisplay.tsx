import "../../styles/global.css";
import { AnimationScope } from "framer-motion";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";

interface Props {
  playerScope: AnimationScope;
  dealerScope: AnimationScope;
  splitScope: AnimationScope;
}

export default function HandsDisplay({ playerScope, dealerScope, splitScope }: Props) {
  return (
    <div className="hands-display">
      <DealerHand scope={dealerScope} />
      <PlayerHand playerScope={playerScope} splitScope={splitScope} />
    </div>
  );
}

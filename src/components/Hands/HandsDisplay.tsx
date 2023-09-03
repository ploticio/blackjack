import "../../styles/PlayerHand.css";
import { AnimationScope } from "framer-motion";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";

interface Props {
  renderPlayerCardsAnimation: () => Promise<void>;
  renderDealerCardsAnimation: () => Promise<void>;
  playerScope: AnimationScope;
  dealerScope: AnimationScope;
  splitScope: AnimationScope;
}

export default function HandsDisplay({
  playerScope,
  dealerScope,
  splitScope,
  renderPlayerCardsAnimation,
  renderDealerCardsAnimation,
}: Props) {
  return (
    <div className="hands-display">
      <DealerHand scope={dealerScope} renderDealerCardsAnimation={renderDealerCardsAnimation} />
      <PlayerHand
        playerScope={playerScope}
        splitScope={splitScope}
        renderPlayerCardsAnimation={renderPlayerCardsAnimation}
      />
    </div>
  );
}

import Controls from "./Controls";
import HandsDisplay from "../Hands/HandsDisplay";
import usePlayerAnimations from "../../hooks/usePlayerAnimations";
import useDealerAnimations from "../../hooks/useDealerAnimations";
import useSplitAnimations from "../../hooks/useSplitAnimations";

export default function GameUI() {
  const {
    scope: playerScope,
    playerEnterAnimation,
    playerExitAnimation,
    renderPlayerCardsAnimation,
    playerSplitAnimation,
  } = usePlayerAnimations();

  const {
    scope: dealerScope,
    dealerEnterAnimation,
    dealerExitAnimation,
    renderDealerCardsAnimation,
    enterFlipAnimation,
    exitFlipAnimation,
  } = useDealerAnimations();

  const { scope: splitScope, splitEnterAnimation, splitExitAnimation } = useSplitAnimations();

  return (
    <>
      <HandsDisplay
        playerScope={playerScope}
        dealerScope={dealerScope}
        splitScope={splitScope}
        renderPlayerCardsAnimation={renderPlayerCardsAnimation}
        renderDealerCardsAnimation={renderDealerCardsAnimation}
      />
      <Controls
        playerEnterAnimation={playerEnterAnimation}
        playerExitAnimation={playerExitAnimation}
        playerSplitAnimation={playerSplitAnimation}
        dealerEnterAnimation={dealerEnterAnimation}
        dealerExitAnimation={dealerExitAnimation}
        enterFlipAnimation={enterFlipAnimation}
        exitFlipAnimation={exitFlipAnimation}
        splitEnterAnimation={splitEnterAnimation}
        splitExitAnimation={splitExitAnimation}
      />
    </>
  );
}

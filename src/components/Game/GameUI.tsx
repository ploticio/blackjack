import Controls from "./Controls";
import HandsDisplay from "../Hands/HandsDisplay";
import usePlayerAnimations from "../../hooks/usePlayerAnimations";
import useDealerAnimations from "../../hooks/useDealerAnimations";
import useSplitAnimations from "../../hooks/useSplitAnimations";
import Preloader from "../Hands/Preloader";

export default function GameUI() {
  const {
    scope: playerScope,
    playerEnterAnimation,
    playerExitAnimation,
    playerSplitAnimation,
    playerInitAnimation,
  } = usePlayerAnimations();

  const {
    scope: dealerScope,
    dealerEnterAnimation,
    dealerExitAnimation,
    enterFlipAnimation,
    exitFlipAnimation,
    dealerInitAnimation,
  } = useDealerAnimations();

  const { scope: splitScope, splitEnterAnimation, splitExitAnimation } = useSplitAnimations();

  return (
    <>
      <HandsDisplay playerScope={playerScope} dealerScope={dealerScope} splitScope={splitScope} />
      <Preloader />
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
        playerInitAnimation={playerInitAnimation}
        dealerInitAnimation={dealerInitAnimation}
      />
    </>
  );
}

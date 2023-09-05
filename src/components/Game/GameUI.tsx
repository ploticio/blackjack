import Controls from "./Controls";
import HandsDisplay from "../Hands/HandsDisplay";
import usePlayerAnimations from "../../hooks/usePlayerAnimations";
import useDealerAnimations from "../../hooks/useDealerAnimations";
import useSplitAnimations from "../../hooks/useSplitAnimations";
import Preloader from "../Hands/Preloader";

export default function GameUI() {
  const { scope: playerScope, playerAnimations } = usePlayerAnimations();

  const { scope: dealerScope, dealerAnimations } = useDealerAnimations();

  const { scope: splitScope, splitAnimations } = useSplitAnimations();

  return (
    <>
      <HandsDisplay playerScope={playerScope} dealerScope={dealerScope} splitScope={splitScope} />
      <Preloader />
      <Controls
        playerAnimations={playerAnimations}
        dealerAnimations={dealerAnimations}
        splitAnimations={splitAnimations}
      />
    </>
  );
}

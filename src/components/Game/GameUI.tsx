import Controls from "./Controls";
import ResultOverlay from "./ResultOverlay";
import HandsDisplay from "../Hands/HandsDisplay";
import Preloader from "../Hands/Preloader";
import usePlayerAnimations from "../../hooks/usePlayerAnimations";
import useDealerAnimations from "../../hooks/useDealerAnimations";
import useSplitAnimations from "../../hooks/useSplitAnimations";
import useOverlayAnimations from "../../hooks/useOverlayAnimations";
import { useState } from "react";

export default function GameUI({ playCardSound }: { playCardSound: () => void }) {
  const { scope: playerScope, playerAnimations } = usePlayerAnimations();
  const { scope: dealerScope, dealerAnimations } = useDealerAnimations();
  const { scope: splitScope, splitAnimations } = useSplitAnimations();
  const { scope: overlayScope, overlayAnimations } = useOverlayAnimations();
  const [overlayValue, setOverlayValue] = useState("N/A");

  return (
    <>
      <ResultOverlay scope={overlayScope} result={overlayValue} />
      <HandsDisplay playerScope={playerScope} dealerScope={dealerScope} splitScope={splitScope} />
      <Preloader />
      <Controls
        playerAnimations={playerAnimations}
        dealerAnimations={dealerAnimations}
        splitAnimations={splitAnimations}
        overlayAnimations={overlayAnimations}
        setOverlayValue={setOverlayValue}
        playCardSound={playCardSound}
      />
    </>
  );
}

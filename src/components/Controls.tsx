import { useEffect } from "react";
import { useStore, Status } from "../store/store";
import { card_back } from "../utilities/cards";

export default function Controls() {
  const resetHands = useStore((state) => state.resetHands);
  const playerHand = useStore((state) => state.playerHand);
  const playerStanding = useStore((state) => state.playerStanding);
  const playerSum = useStore((state) => state.getPlayerSum);
  const dealerSum = useStore((state) => state.getDealerSum);
  const status = useStore((state) => state.status);

  const flipCard = useStore((state) => state.flipCard);
  const sample = useStore((state) => state.sample);
  const addToDealer = useStore((state) => state.addToDealer);

  const addToPlayer = useStore((state) => state.addToPlayer);
  const setPlayerStanding = useStore((state) => state.setPlayerStanding);
  const setHoleImg = useStore((state) => state.setHoleImg);
  const setStatus = useStore((state) => state.setStatus);

  // Check for player busting
  useEffect(() => {
    if (playerSum().hardTotal > 21) setStatus(Status.Loss);
  }, [playerHand, playerSum, setStatus]);

  // Handle Player busting
  useEffect(() => {
    if (status == Status.Loss) {
      flipCard();
    }
  }, [status, flipCard, setStatus]);

  // Handle Player standing
  useEffect(() => {
    if (playerStanding) {
      flipCard();
      while (dealerSum().softTotal < 17) addToDealer(sample());
      if (dealerSum().hardTotal > 21) setStatus(Status.Win);
      else {
        const pSum = playerSum().softTotal <= 21 ? playerSum().softTotal : playerSum().hardTotal;
        const dSum = dealerSum().softTotal <= 21 ? dealerSum().softTotal : dealerSum().hardTotal;
        if (pSum > dSum) setStatus(Status.Win);
        else if (pSum < dSum) setStatus(Status.Loss);
        else setStatus(Status.Push);
      }
    }
  }, [playerStanding, flipCard, dealerSum, playerSum, addToDealer, sample, setStatus]);

  const handleNewRound = () => {
    resetHands();

    addToDealer(sample());
    const holeCard = { ...sample() };
    setHoleImg(holeCard.image);
    holeCard.image = card_back;
    addToDealer(holeCard);

    addToPlayer(sample());
    addToPlayer(sample());
    setPlayerStanding(false);
    setStatus(Status.Playing);
  };

  return (
    <>
      <button
        onClick={() => {
          addToPlayer(sample());
        }}
      >
        Hit
      </button>
      <button
        onClick={() => {
          setPlayerStanding(true);
        }}
      >
        Stand
      </button>
      <button onClick={() => handleNewRound()}>Reset Hands</button>
    </>
  );
}

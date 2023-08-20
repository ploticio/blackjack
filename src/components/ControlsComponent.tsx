import { useEffect } from "react";
import { useStore } from "../store/store";
import { card_back } from "../utilities/cards";

export default function ControlsComponent() {
  const resetHands = useStore((state) => state.resetHands);
  const playerHand = useStore((state) => state.playerHand);
  const dealerHand = useStore((state) => state.dealerHand);
  const playerStanding = useStore((state) => state.playerStanding);
  const playerBust = useStore((state) => state.playerBust);
  const dealerBust = useStore((state) => state.dealerBust);
  const dealerSum = useStore((state) => state.getDealerSum);

  const flipCard = useStore((state) => state.flipCard);
  const sample = useStore((state) => state.sample);
  const addToDealer = useStore((state) => state.addToDealer);

  const addToPlayer = useStore((state) => state.addToPlayer);
  const setPlayerBust = useStore((state) => state.setPlayerBust);
  const setDealerBust = useStore((state) => state.setDealerBust);
  const setPlayerStanding = useStore((state) => state.setPlayerStanding);
  const setHoleImg = useStore((state) => state.setHoleImg);

  // Check for player busting
  useEffect(() => {
    const sum = playerHand.reduce((acc, card) => acc + card.value, 0);
    if (sum > 21) {
      setPlayerBust(true);
    }
  }, [playerHand, setPlayerBust]);

  // Handle Player busting
  useEffect(() => {
    if (playerBust) {
      flipCard();
    }
  }, [playerBust, flipCard]);

  // Handle Player standing
  useEffect(() => {
    if (playerStanding) {
      flipCard();
      while (dealerSum() < 17) {
        const newCard = sample();
        addToDealer(newCard);
      }
      if (dealerSum() > 21) setDealerBust(true);
    }
  }, [playerStanding, flipCard, dealerSum, addToDealer, sample, setDealerBust]);

  const handleNewRound = () => {
    resetHands();

    addToDealer(sample());
    const holeCard = { ...sample() };
    setHoleImg(holeCard.image);
    holeCard.image = card_back;
    addToDealer(holeCard);

    addToPlayer(sample());
    addToPlayer(sample());

    setPlayerBust(false);
    setDealerBust(false);
    setPlayerStanding(false);
    console.log(dealerSum);
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

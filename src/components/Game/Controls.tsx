import { useEffect } from "react";
import { useStore, Status } from "../../store/store";

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
  const setStatus = useStore((state) => state.setStatus);

  const bank = useStore((state) => state.bank);
  const bet = useStore((state) => state.getBet);
  const changeBank = useStore((state) => state.changeBank);
  const changeBet = useStore((state) => state.changeBet);

  // Check for player busting
  useEffect(() => {
    if (playerSum().hardTotal > 21) setStatus(Status.Bust);
  }, [playerHand, playerSum, setStatus]);

  // Handle Player outcomes
  useEffect(() => {
    if (status === Status.Bust) {
      flipCard();
    } else if (status === Status.Push) {
      changeBank(bet());
    } else if (status === Status.Win) {
      changeBank(2 * bet());
    }
  }, [status, flipCard, setStatus, changeBank, bet]);

  // Handle Player standing
  useEffect(() => {
    if (playerStanding) {
      flipCard();
      while (dealerSum().softTotal < 17 || (dealerSum().softTotal > 21 && dealerSum().hardTotal < 17)) {
        addToDealer(sample());
      }
      if (dealerSum().hardTotal > 21) {
        setStatus(Status.Win);
      } else {
        const pSum = playerSum().softTotal <= 21 ? playerSum().softTotal : playerSum().hardTotal;
        const dSum = dealerSum().softTotal <= 21 ? dealerSum().softTotal : dealerSum().hardTotal;
        if (pSum > dSum) setStatus(Status.Win);
        else if (pSum < dSum) {
          setStatus(Status.Loss);
        } else setStatus(Status.Push);
      }
    }
  }, [playerStanding, flipCard, dealerSum, playerSum, addToDealer, sample, setStatus]);

  const handleHit = () => {
    addToPlayer(sample());
  };

  const handleDouble = () => {
    changeBank(-1 * bet());
    changeBet(2 * bet());
    addToPlayer(sample());
    setPlayerStanding(true);
  };

  const handleNewRound = () => {
    resetHands();
    setPlayerStanding(false);
    changeBet(-1 * bet());
    setStatus(Status.Betting);
  };

  return (
    <>
      {status === Status.Playing && (
        <>
          <button onClick={() => handleHit()}>Hit</button>
          <button onClick={() => setPlayerStanding(true)}>Stand</button>
          {/* {2 * bet() <= bank && <button onClick={() => handleDouble()}>Double</button>} */}
        </>
      )}
      <button onClick={() => handleNewRound()}>Reset Hands</button>
    </>
  );
}

import { Status, useStore } from "../../store/store";

export default function BankControls() {
  const setStatus = useStore((state) => state.setStatus);
  const shuffle = useStore((state) => state.shuffle);
  const sample = useStore((state) => state.sample);
  const addToDealer = useStore((state) => state.addToDealer);
  const addToPlayer = useStore((state) => state.addToPlayer);
  const addHoleCard = useStore((state) => state.addHoleCard);

  const bank = useStore((state) => state.bank);
  const bet = useStore((state) => state.bet);
  const changeBank = useStore((state) => state.changeBank);
  const changeBet = useStore((state) => state.changeBet);

  const handleSubmit = () => {
    changeBank(-1 * bet);

    setStatus(Status.Playing);
    for (let i = 0; i < 10; i++) {
      shuffle();
    }
    addToDealer(sample());
    addHoleCard();
    addToPlayer(sample());
    addToPlayer(sample());
  };

  const handleChangeBet = (amount: number) => {
    if (bet < bank) changeBet(amount);
  };

  return (
    <>
      <button onClick={() => handleChangeBet(1)}>+1</button>
      <button onClick={() => handleChangeBet(5)}>+5</button>
      <button onClick={() => handleChangeBet(25)}>+25</button>
      <button onClick={() => handleChangeBet(50)}>+50</button>
      <button onClick={() => handleChangeBet(100)}>+100</button>
      <button onClick={() => changeBet(-1 * bet)}>Reset</button>
      <button onClick={() => handleSubmit()}>Submit Bet</button>
    </>
  );
}

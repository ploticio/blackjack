import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Status } from "../../utilities/hands";
import { animate } from "framer-motion";

interface Props {
  exitAnimation: () => Promise<void>;
}

export default function BankControls({ exitAnimation }: Props) {
  const snapshot = useSnapshot(state);

  const handleSubmit = () => {
    submitBet();
  };

  const handleChangeBet = (amount: number) => {
    if (state.bet + amount < state.bank) {
      state.bet = state.bet + amount;
      animate(state.buffer, state.bet, {
        duration: 1,
        onUpdate: (latest) => (state.buffer = Math.floor(latest)),
      });
    }
  };

  const handleResetBet = () => {
    state.bet = 0;
    animate(state.buffer, state.bet, {
      duration: 1,
      onUpdate: (latest) => (state.buffer = Math.floor(latest)),
    });
  };

  async function submitBet() {
    state.playerHand.bet = state.bet;
    await exitAnimation();
    state.gameState = GameState.Playing;
    initGame();
  }

  async function initGame() {
    state.playerHand.hand.status = Status.Playing;
    state.dealerHand.hand.status = Status.Standby;

    state.playerHand.hand.addRandom();
    state.dealerHand.hand.addRandom();
    state.playerHand.hand.addRandom();
    state.dealerHand.addHoleCard();
  }

  return (
    <>
      <button onClick={() => handleChangeBet(5)}>+5</button>
      <button onClick={() => handleChangeBet(10)}>+10</button>
      <button onClick={() => handleChangeBet(25)}>+25</button>
      <button onClick={() => handleChangeBet(50)}>+50</button>
      <button onClick={() => handleChangeBet(100)}>+100</button>
      <button onClick={() => handleResetBet()}>Reset</button>
      {snapshot.bet > 0 && (
        <div>
          <button id="submit" onClick={() => handleSubmit()}>
            Submit Bet
          </button>
        </div>
      )}
    </>
  );
}

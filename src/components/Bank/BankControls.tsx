import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Status } from "../../utilities/hands";

export default function BankControls() {
  const snapshot = useSnapshot(state);

  const handleSubmit = () => {
    state.playerHand.bet = state.bet;
    state.gameState = GameState.Playing;
    initGame();
  };

  const initGame = () => {
    state.playerHand.hand.addRandom();
    state.dealerHand.hand.addRandom();
    state.playerHand.hand.addRandom();
    state.dealerHand.addHoleCard();
    state.bet = 0;
    handleBlackjacks();
  };

  const handleBlackjacks = () => {
    // Handle Blackjack at game start
    state.playerHand.checkBlackjack();
    state.dealerHand.checkBlackjack();
    const pBlackjack = state.playerHand.blackjack;
    const dBlackjack = state.dealerHand.blackjack;
    if (pBlackjack && !dBlackjack) {
      state.dealerHand.flipCard();
      state.dealerHand.hand.status = Status.Loss;
      state.playerHand.hand.status = Status.Win;
    } else if (!pBlackjack && dBlackjack) {
      state.dealerHand.flipCard();
      state.dealerHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Loss;
    } else if (pBlackjack && dBlackjack) {
      state.dealerHand.flipCard();
      state.playerHand.hand.status = Status.Push;
      state.dealerHand.hand.status = Status.Push;
    }
  };

  const handleChangeBet = (amount: number) => {
    if (snapshot.bet < snapshot.bank) state.bet = snapshot.bet + amount;
  };

  return (
    <>
      <button onClick={() => handleChangeBet(5)}>+5</button>
      <button onClick={() => handleChangeBet(10)}>+10</button>
      <button onClick={() => handleChangeBet(25)}>+25</button>
      <button onClick={() => handleChangeBet(50)}>+50</button>
      <button onClick={() => handleChangeBet(100)}>+100</button>
      <button onClick={() => (state.bet = 0)}>Reset</button>
      {snapshot.bet > 0 && <button onClick={() => handleSubmit()}>Submit Bet</button>}
    </>
  );
}

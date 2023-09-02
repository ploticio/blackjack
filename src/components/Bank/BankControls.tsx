import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Status } from "../../utilities/hands";
import { AppSettings } from "../AppSettings";
import { animate } from "framer-motion";
import { useEffect } from "react";
// import { ace_card, two_card, ten_card } from "../../utilities/cards";

export default function BankControls({ exitAnimation }: { exitAnimation: () => Promise<void> }) {
  const snapshot = useSnapshot(state);

  const handleSubmit = () => {
    submitBet();
  };

  const handleChangeBet = (amount: number) => {
    if (state.bet < state.bank) {
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

  useEffect(() => {
    state.buffer = 0;
  });

  async function submitBet() {
    state.playerHand.bet = state.bet;
    await exitAnimation();
    state.gameState = GameState.Playing;
    initGame();
  }

  function initGame() {
    state.playerHand.hand.status = Status.Playing;
    state.dealerHand.hand.status = Status.Standby;

    state.playerHand.hand.addRandom();
    state.dealerHand.hand.addRandom();
    state.playerHand.hand.addRandom();
    state.dealerHand.addHoleCard();

    // state.playerHand.hand.addToHand(two_card);
    // state.dealerHand.hand.addToHand(two_card);
    // state.playerHand.hand.addToHand(two_card);
    // state.dealerHand.addHoleCard(two_card);

    state.bet = 0;
    handleBlackjacks();
  }

  function handleBlackjacks() {
    // Handle Blackjack at game start
    const pBlackjack = state.playerHand.checkBlackjack();
    const dBlackjack = state.dealerHand.checkBlackjack();
    if (pBlackjack && !dBlackjack) {
      setTimeout(() => {
        state.dealerHand.flipCard();
      }, AppSettings.FLIP_CARD_OUTCOME_SPEED * 1000);
      state.dealerHand.hand.status = Status.Loss;
      state.playerHand.hand.status = Status.Win;
    } else if (!pBlackjack && dBlackjack) {
      setTimeout(() => {
        state.dealerHand.flipCard();
      }, AppSettings.FLIP_CARD_OUTCOME_SPEED * 350);
      state.dealerHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Loss;
    } else if (pBlackjack && dBlackjack) {
      setTimeout(() => {
        state.dealerHand.flipCard();
      }, AppSettings.FLIP_CARD_OUTCOME_SPEED * 350);
      state.dealerHand.hand.status = Status.Push;
      state.playerHand.hand.status = Status.Push;
    }
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

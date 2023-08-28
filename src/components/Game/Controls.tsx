import { useRef } from "react";
import { useSnapshot } from "valtio";
import { GameState, state } from "../../store/store";
import { Status } from "../../utilities/hands";

export default function Controls() {
  const snapshot = useSnapshot(state);

  const activeHand = useRef(state.playerHand);
  const activeHandSnapshot = activeHand.current == state.playerHand ? snapshot.playerHand : snapshot.splitHand;

  const handleHit = () => {
    activeHand.current.hand.addRandom();
    // Check for busts
    if (activeHand.current.hand.getSum().hardTotal > 21) {
      activeHand.current.hand.status = Status.Bust;
      // Single hand bust
      if (activeHand.current == state.playerHand && state.splitHand.hand.status !== Status.Standing) {
        state.dealerHand.flipCard();
        state.dealerHand.hand.status = Status.Win;
      }
      // Two hand playerdeck bust
      else if (activeHand.current == state.playerHand && state.splitHand.hand.status == Status.Standing)
        handleStanding();
      // Two hand splitdeck bust
      else if (activeHand.current == state.splitHand) {
        state.playerHand.hand.addRandom();
        // Check if playerhand gets a blackjack after splithand busts
        state.playerHand.checkBlackjack();
        if (state.playerHand.blackjack) {
          state.playerHand.hand.status = Status.Win;
          handleStanding();
        }
      }
      switchIfSplit();
    }
    // Stand immediately if hardtotal is equal to 21
    else if (activeHand.current.hand.getSum().hardTotal === 21) {
      if (activeHand.current == state.playerHand) handleStanding();
      else {
        activeHand.current.hand.status = Status.Standing;
        state.playerHand.hand.addRandom();
        switchIfSplit();
      }
    }
  };

  const handleStanding = () => {
    // Switch to playerhand if currently splithand
    if (activeHand.current == state.splitHand) {
      activeHand.current.hand.status = Status.Standing;
      activeHand.current = state.playerHand;
      state.playerHand.hand.addRandom();
      // Check if playerhand gets blackjack after splithand stands
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        handleStanding();
      }
    }
    // Hit dealer
    else {
      if (state.playerHand.hand.status !== Status.Bust && state.playerHand.hand.status !== Status.Win)
        // All hands set from playing => standing except for busts / split blackjacks
        state.playerHand.hand.status = Status.Standing;
      state.dealerHand.flipCard();
      // Stand on soft 17
      while (
        state.dealerHand.hand.getSum().softTotal < 17 ||
        (state.dealerHand.hand.getSum().softTotal > 21 && state.dealerHand.hand.getSum().hardTotal < 17)
      ) {
        state.dealerHand.hand.addRandom();
      }
      state.dealerHand.hand.status = Status.Standing;
      // Check for dealer bust
      if (state.dealerHand.hand.getSum().hardTotal > 21) {
        state.dealerHand.hand.status = Status.Bust;
        if (state.playerHand.hand.status === Status.Standing) state.playerHand.hand.status = Status.Win;
        if (state.splitHand.hand.status === Status.Standing) state.splitHand.hand.status = Status.Win;
      } else {
        const dSum =
          state.dealerHand.hand.getSum().softTotal <= 21
            ? state.dealerHand.hand.getSum().softTotal
            : state.dealerHand.hand.getSum().hardTotal;
        // Compare playerhand if not already busted
        if (state.playerHand.hand.status === Status.Standing) {
          const pSum =
            state.playerHand.hand.getSum().softTotal <= 21
              ? state.playerHand.hand.getSum().softTotal
              : state.playerHand.hand.getSum().hardTotal;
          if (pSum > dSum) state.playerHand.hand.status = Status.Win;
          else if (pSum < dSum) state.playerHand.hand.status = Status.Loss;
          else state.playerHand.hand.status = Status.Push;
        }
        // Compare splithand if not already busted
        if (state.splitHand.hand.status === Status.Standing) {
          const sSum =
            state.splitHand.hand.getSum().softTotal <= 21
              ? state.splitHand.hand.getSum().softTotal
              : state.splitHand.hand.getSum().hardTotal;
          if (sSum > dSum) state.splitHand.hand.status = Status.Win;
          else if (sSum < dSum) state.splitHand.hand.status = Status.Loss;
          else state.splitHand.hand.status = Status.Push;
        }
      }
    }
  };

  const handleDouble = () => {
    activeHand.current.bet *= 2;
    handleHit();
    // Prevent handleStanding from being called twice
    if (
      state.playerHand.hand.getSum().hardTotal !== 21 &&
      state.playerHand.hand.status !== Status.Bust &&
      state.splitHand.hand.getSum().hardTotal !== 21 &&
      state.splitHand.hand.status !== Status.Bust
    )
      handleStanding();
  };

  const handleSplit = () => {
    const temp = state.playerHand.hand.removeEnd();
    state.splitHand.hand.addToHand(temp);
    state.splitHand.hand.addRandom();
    state.splitHand.bet = activeHandSnapshot.bet;
    activeHand.current = state.splitHand;
    // Check if blackjack immediately after splitting
    state.splitHand.checkBlackjack();
    if (state.splitHand.blackjack) {
      state.splitHand.hand.status = Status.Win;
      switchIfSplit();
      // Check for double blackjack
      state.playerHand.hand.addRandom();
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        state.dealerHand.flipCard();
      }
    }
  };

  const handleNewRound = () => {
    state.dealerHand.resetHand();
    state.playerHand.resetHand();
    state.splitHand.resetHand();
    handleEarnings();
    if (state.bank <= 0) state.gameState = GameState.Gameover;
    else {
      if (state.shoe.length < 52) handleShuffle();
      state.gameState = GameState.Betting;
    }
  };

  const handleEarnings = () => {
    let earnings = 0;
    // Handle player hand earnings
    if (snapshot.playerHand.hand.status === Status.Win) {
      earnings += snapshot.playerHand.bet;
      if (snapshot.playerHand.blackjack) earnings += snapshot.playerHand.bet * 0.5;
    } else if (snapshot.playerHand.hand.status === Status.Loss || snapshot.playerHand.hand.status === Status.Bust)
      earnings -= snapshot.playerHand.bet;
    // Handle split hand earnings
    if (snapshot.splitHand.hand.status === Status.Win) {
      earnings += snapshot.splitHand.bet;
      if (snapshot.splitHand.blackjack) earnings += snapshot.splitHand.bet * 0.5;
    } else if (snapshot.splitHand.hand.status === Status.Loss || snapshot.splitHand.hand.status === Status.Bust)
      earnings -= snapshot.splitHand.bet;
    state.bank += earnings;
  };

  const handleShuffle = () => {
    state.shoe = [...state.shoe, ...state.discarded];
    state.discarded = [];
    for (let i = 0; i < 10; i++) {
      state.shoe = state.shoe
        .map((card) => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }
  };

  const switchIfSplit = () => {
    if (activeHand.current == state.splitHand) activeHand.current = state.playerHand;
  };

  const canSplit = () => {
    return (
      snapshot.playerHand.hand.cards.length === 2 &&
      snapshot.playerHand.hand.cards[0].value === snapshot.playerHand.hand.cards[1].value &&
      snapshot.bank - snapshot.playerHand.bet >= snapshot.playerHand.bet &&
      activeHandSnapshot !== snapshot.splitHand &&
      snapshot.splitHand.hand.status !== Status.Standing &&
      snapshot.splitHand.hand.status !== Status.Win &&
      snapshot.splitHand.hand.status !== Status.Bust
    );
  };

  const canDouble = () => {
    const combined = snapshot.playerHand.bet + snapshot.splitHand.bet;
    return activeHandSnapshot.hand.cards.length === 2 && snapshot.bank - combined >= 2 * activeHandSnapshot.bet;
  };

  return (
    <div>
      {activeHandSnapshot.hand.status === Status.Playing && (
        <>
          <button onClick={() => handleHit()}>Hit</button>
          <button onClick={() => handleStanding()}>Stand</button>
          {canDouble() && <button onClick={() => handleDouble()}>Double</button>}
          {canSplit() && <button onClick={() => handleSplit()}>Split</button>}
        </>
      )}
      {snapshot.playerHand.hand.status !== Status.Playing && (
        <button onClick={() => handleNewRound()}>Reset Hands</button>
      )}
    </div>
  );
}

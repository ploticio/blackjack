import { useSnapshot } from "valtio";
import { GameState, state } from "../../store/store";
import { Status } from "../../utilities/hands";
import { useEffect, useRef } from "react";

export default function Controls() {
  const snapshot = useSnapshot(state);
  const timerId = useRef<number>();
  const dealerSum = snapshot.dealerHand.hand.getSum().hardTotal;

  const handleHit = () => {
    hit();
  };

  const handleStanding = () => {
    stand();
  };

  const handleDouble = () => {
    double();
  };

  const handleSplit = () => {
    split();
  };

  const handleNewRound = () => {
    resetRound();
  };

  function hit() {
    if (state.splitHand.hand.status === Status.Playing) hitSplitHand();
    else hitPlayerHand();
  }

  function hitPlayerHand() {
    state.playerHand.hand.addRandom();
    if (state.playerHand.hand.getSum().hardTotal > 21) {
      state.playerHand.hand.status = Status.Bust;
      if (state.splitHand.hand.status === Status.Standing) stand();
      // End round if player busts and splithand is a blackjack
      else if (state.splitHand.hand.status === Status.Win) {
        state.dealerHand.hand.status = Status.Loss;
        state.dealerHand.flipCard();
      } else {
        state.dealerHand.hand.status = Status.Win;
        state.dealerHand.flipCard();
      }
    }
  }

  function hitSplitHand() {
    state.splitHand.hand.addRandom();
    if (state.splitHand.hand.getSum().hardTotal > 21) {
      state.splitHand.hand.status = Status.Bust;
      state.playerHand.hand.status = Status.Playing;
      setTimeout(() => {
        state.playerHand.hand.addRandom();
      }, 1000);
      // Check if playerhand gets a blackjack after splithand busts
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        stand();
      }
    }
  }

  function stand() {
    if (state.splitHand.hand.status === Status.Playing) {
      state.splitHand.hand.status = Status.Standing;
      state.playerHand.hand.status = Status.Playing;
      state.playerHand.hand.addRandom();
      // Check if playerhand gets blackjack after splithand stands
      if (state.playerHand.checkBlackjack()) {
        state.playerHand.hand.status = Status.Win;
        stand();
      }
    } else {
      // Set playerhand to Standing if not already a blackjack/bust (accounts for split hand situations)
      if (state.playerHand.hand.status !== Status.Bust && state.playerHand.hand.status !== Status.Win)
        state.playerHand.hand.status = Status.Standing;
      state.dealerHand.flipCard();
      timerId.current = setInterval(() => {
        state.dealerHand.hand.addRandom();
      }, 1000);
    }
  }

  useEffect(() => {
    if (
      (state.dealerHand.hand.getSum().softTotal >= 17 && state.dealerHand.hand.getSum().softTotal <= 21) ||
      state.dealerHand.hand.getSum().hardTotal >= 17
    ) {
      clearInterval(timerId.current);
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
        // Compare playerhand if not already blackjack/busted
        if (state.playerHand.hand.status === Status.Standing) {
          const pSum =
            state.playerHand.hand.getSum().softTotal <= 21
              ? state.playerHand.hand.getSum().softTotal
              : state.playerHand.hand.getSum().hardTotal;
          if (pSum > dSum) state.playerHand.hand.status = Status.Win;
          else if (pSum < dSum) state.playerHand.hand.status = Status.Loss;
          else state.playerHand.hand.status = Status.Push;
        }
        // Compare splithand if not already blackjack/busted
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
  }, [dealerSum]);

  function double() {
    if (state.splitHand.hand.status === Status.Playing) {
      state.splitHand.bet *= 2;
      hitSplitHand();
      // Prevent possiblity of stand() more than once
      if (state.splitHand.hand.getSum().hardTotal <= 21) stand();
    } else {
      state.playerHand.bet *= 2;
      hitPlayerHand();
      // Prevent possiblity of stand() more than once
      if (state.playerHand.hand.getSum().hardTotal <= 21) stand();
    }
  }

  function split() {
    state.playerHand.hand.status = Status.Standby;
    state.splitHand.hand.status = Status.Playing;
    const temp = state.playerHand.removeEnd();
    state.splitHand.hand.addToHand(temp);
    state.splitHand.hand.addRandom();
    state.splitHand.bet = state.playerHand.bet;
    // Check for blackjack immediately after splitting
    state.splitHand.checkBlackjack();
    if (state.splitHand.blackjack) {
      state.splitHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Playing;
      state.playerHand.hand.addRandom();
      // Check for double blackjack
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        state.dealerHand.hand.status = Status.Loss;
        state.dealerHand.flipCard();
      }
    }
  }

  function resetRound() {
    handleEarnings();
    state.dealerHand.resetHand();
    state.playerHand.resetHand();
    state.splitHand.resetHand();
    if (state.bank <= 0) state.gameState = GameState.Gameover;
    else {
      if (state.shoe.length < 52) handleShuffle();
      state.gameState = GameState.Betting;
    }
  }

  function handleEarnings() {
    let earnings = 0;
    // Handle playerhand earnings
    if (state.playerHand.hand.status === Status.Win) {
      earnings += state.playerHand.bet;
      if (state.playerHand.blackjack) earnings += state.playerHand.bet * 0.5;
    } else if (state.playerHand.hand.status === Status.Loss || state.playerHand.hand.status === Status.Bust)
      earnings -= state.playerHand.bet;
    // Handle splithand earnings
    if (state.splitHand.hand.status === Status.Win) {
      earnings += state.splitHand.bet;
      if (state.splitHand.blackjack) earnings += state.splitHand.bet * 0.5;
    } else if (state.splitHand.hand.status === Status.Loss || state.splitHand.hand.status === Status.Bust)
      earnings -= state.splitHand.bet;
    state.bank += earnings;
  }

  function handleShuffle() {
    state.shoe = [...state.shoe, ...state.discarded];
    state.discarded = [];
    for (let i = 0; i < 10; i++) {
      state.shoe = state.shoe
        .map((card) => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }
  }

  const canSplit =
    snapshot.splitHand.hand.status === Status.Standby &&
    snapshot.playerHand.hand.cards.length === 2 &&
    snapshot.playerHand.hand.cards[0].value === snapshot.playerHand.hand.cards[1].value;

  const canDouble =
    (snapshot.playerHand.hand.status === Status.Playing &&
      snapshot.playerHand.hand.cards.length === 2 &&
      snapshot.bank - snapshot.playerHand.bet + snapshot.splitHand.bet >= 2 * snapshot.playerHand.bet) ||
    (snapshot.splitHand.hand.status === Status.Playing &&
      snapshot.splitHand.hand.cards.length === 2 &&
      snapshot.bank - snapshot.playerHand.bet + snapshot.splitHand.bet >= 2 * snapshot.splitHand.bet);

  return (
    <div>
      {(snapshot.playerHand.hand.status === Status.Playing || snapshot.splitHand.hand.status === Status.Playing) && (
        <>
          <button onClick={() => handleHit()}>Hit</button>
          <button onClick={() => handleStanding()}>Stand</button>
          {canDouble && <button onClick={() => handleDouble()}>Double</button>}
          {canSplit && <button onClick={() => handleSplit()}>Split</button>}
        </>
      )}
      {snapshot.playerHand.hand.status !== Status.Playing && (
        <button onClick={() => handleNewRound()}>Reset Hands</button>
      )}
    </div>
  );
}

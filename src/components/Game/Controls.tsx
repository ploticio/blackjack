import { useSnapshot } from "valtio";
import { GameState, state } from "../../store/store";
import { Status } from "../../utilities/hands";
import { useEffect, useState } from "react";

interface Props {
  playerEnterAnimation: () => Promise<void>;
  playerExitAnimation: () => Promise<void>;
  playerSplitAnimation: () => Promise<void>;
  dealerEnterAnimation: () => Promise<void>;
  dealerExitAnimation: () => Promise<void>;
  enterFlipAnimation: () => Promise<void>;
  exitFlipAnimation: () => Promise<void>;
  splitEnterAnimation: () => Promise<void>;
  splitExitAnimation: () => Promise<void>;
  playerInitAnimation: () => Promise<void>;
  dealerInitAnimation: () => Promise<void>;
}

export default function Controls({
  playerEnterAnimation,
  playerExitAnimation,
  playerSplitAnimation,
  dealerEnterAnimation,
  dealerExitAnimation,
  enterFlipAnimation,
  exitFlipAnimation,
  splitEnterAnimation,
  splitExitAnimation,
  playerInitAnimation,
  dealerInitAnimation,
}: Props) {
  const snapshot = useSnapshot(state);
  const [enableControls, setEnableControls] = useState(false);

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

  useEffect(() => {
    playAnimations();
  }, [snapshot.playerHand.hand.cards, snapshot.dealerHand.hand.cards]);

  useEffect(() => {
    if (state.splitHand.hand.cards.length > 0) splitEnterAnimation();
  }, [snapshot.splitHand.hand.cards]);

  async function playAnimations() {
    if (snapshot.playerHand.hand.cards.length <= 2) await playerInitAnimation();
    if (snapshot.dealerHand.hand.cards.length <= 2) await dealerInitAnimation();
    if (snapshot.playerHand.hand.status === Status.Playing) await playerEnterAnimation();
    await dealerEnterAnimation();
    if (state.playerHand.hand.cards.length === 2 && state.dealerHand.hand.cards.length === 2) {
      await handleBlackjacks();
    }
    setEnableControls(true);
  }

  function hit() {
    if (state.splitHand.hand.status === Status.Playing) hitSplitHand();
    else hitPlayerHand();
  }

  async function hitPlayerHand() {
    state.playerHand.hand.addRandom();
    // state.playerHand.hand.addToHand(two_card);
    await playerEnterAnimation();
    if (state.playerHand.hand.getSum().hardTotal > 21) {
      state.playerHand.hand.status = Status.Bust;
      if (state.splitHand.hand.status === Status.Standing) stand();
      // End round if player busts and splithand is a blackjack
      else if (state.splitHand.hand.status === Status.Win) {
        await dealerFlip();
        state.dealerHand.hand.status = Status.Loss;
        await handleNewRound();
      }
      // Else player loses, end round
      else {
        await dealerFlip();
        state.dealerHand.hand.status = Status.Win;
        await handleNewRound();
      }
    }
  }

  async function hitSplitHand() {
    state.splitHand.hand.addRandom();
    await splitEnterAnimation();
    if (state.splitHand.hand.getSum().hardTotal > 21) {
      state.splitHand.hand.status = Status.Bust;
      state.playerHand.hand.status = Status.Playing;
      state.playerHand.hand.addRandom();
      await playerEnterAnimation();
      // Check if playerhand gets a blackjack after splithand busts
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        stand();
      }
    }
  }

  async function stand() {
    if (state.splitHand.hand.status === Status.Playing) {
      state.splitHand.hand.status = Status.Standing;
      state.playerHand.hand.status = Status.Playing;
      state.playerHand.hand.addRandom();
      await playerEnterAnimation();
      // Check if playerhand gets blackjack after splithand stands
      if (state.playerHand.checkBlackjack()) {
        state.playerHand.hand.status = Status.Win;
        stand();
      }
    } else {
      // Set playerhand to Standing if not already a blackjack/bust (accounts for split hand situations)
      if (state.playerHand.hand.status !== Status.Bust && state.playerHand.hand.status !== Status.Win)
        state.playerHand.hand.status = Status.Standing;
      await dealerFlip();
      while (
        state.dealerHand.hand.getSum().softTotal < 17 ||
        (state.dealerHand.hand.getSum().softTotal > 21 && state.dealerHand.hand.getSum().hardTotal < 17)
      ) {
        state.dealerHand.hand.addRandom();
        // state.dealerHand.hand.addToHand(two_card);
        await dealerEnterAnimation();
      }
      state.dealerHand.hand.status = Status.Standing;
      // Check for dealer bust
      if (state.dealerHand.hand.getSum().hardTotal > 21) {
        state.dealerHand.hand.status = Status.Loss;
        if (state.playerHand.hand.status === Status.Standing) state.playerHand.hand.status = Status.Win;
        if (state.splitHand.hand.status === Status.Standing) state.splitHand.hand.status = Status.Win;
        await handleNewRound();
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
          if (pSum > dSum) {
            state.playerHand.hand.status = Status.Win;
            state.dealerHand.hand.status = Status.Loss;
          } else if (pSum < dSum) {
            state.playerHand.hand.status = Status.Loss;
            state.dealerHand.hand.status = Status.Win;
          } else {
            state.playerHand.hand.status = Status.Push;
            state.dealerHand.hand.status = Status.Push;
          }
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
        await handleNewRound();
      }
    }
  }

  async function dealerFlip() {
    await exitFlipAnimation();
    state.dealerHand.hand.cards.pop();
    state.dealerHand.hand.addToHand(state.dealerHand._holeCard);
    await enterFlipAnimation();
  }

  async function double() {
    if (state.splitHand.hand.status === Status.Playing) {
      state.splitHand.bet *= 2;
      await hitSplitHand();
      // Prevent possiblity of stand() more than once
      if (state.splitHand.hand.getSum().hardTotal <= 21) stand();
    } else {
      state.playerHand.bet *= 2;
      await hitPlayerHand();
      // Prevent possiblity of stand() more than once
      if (state.playerHand.hand.getSum().hardTotal <= 21) stand();
    }
  }

  async function split() {
    state.playerHand.hand.status = Status.Standby;
    state.splitHand.hand.status = Status.Playing;
    const temp = { ...state.playerHand.hand.cards[state.playerHand.hand.cards.length - 1] };
    state.splitHand.hand.addToHand(temp);
    await playerSplitAnimation();
    state.playerHand.removeEnd();
    await splitEnterAnimation();
    state.splitHand.hand.addRandom();
    await splitEnterAnimation();
    state.splitHand.bet = state.playerHand.bet;
    // Check for blackjack immediately after splitting
    state.splitHand.checkBlackjack();
    if (state.splitHand.blackjack) {
      state.splitHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Playing;
      await timeout(1000);
      state.playerHand.hand.addRandom();
      await playerEnterAnimation();
      // Check for double blackjack
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        await timeout(1000);
        await dealerFlip();
        state.playerHand.hand.status = Status.Win;
        state.dealerHand.hand.status = Status.Loss;
        await handleNewRound();
      }
    }
  }

  async function handleBlackjacks() {
    // Handle Blackjack at game start
    const pBlackjack = state.playerHand.checkBlackjack();
    const dBlackjack = state.dealerHand.checkBlackjack();
    if (pBlackjack && !dBlackjack) {
      await dealerFlip();
      state.dealerHand.hand.status = Status.Loss;
      state.playerHand.hand.status = Status.Win;
      await handleNewRound();
    } else if (!pBlackjack && dBlackjack) {
      await dealerFlip();
      state.dealerHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Loss;
      await handleNewRound();
    } else if (pBlackjack && dBlackjack) {
      await dealerFlip();
      state.dealerHand.hand.status = Status.Push;
      state.playerHand.hand.status = Status.Push;
      await handleNewRound();
    }
  }

  async function handleNewRound() {
    playerExitAnimation();
    if (snapshot.splitHand.hand.cards.length > 0) splitExitAnimation();
    await dealerExitAnimation();
    resetRound();
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

  const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      {enableControls &&
        (snapshot.playerHand.hand.status === Status.Playing || snapshot.splitHand.hand.status === Status.Playing) && (
          <>
            <button onClick={() => handleHit()}>Hit</button>
            <button onClick={() => handleStanding()}>Stand</button>
            {canDouble && <button onClick={() => handleDouble()}>Double</button>}
            {canSplit && <button onClick={() => handleSplit()}>Split</button>}
          </>
        )}
    </div>
  );
}

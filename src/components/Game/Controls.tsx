import { useSnapshot } from "valtio";
import { GameState, state } from "../../store/store";
import { Status } from "../../utilities/hands";
import { useEffect, useState } from "react";
import { AppSettings } from "../../utilities/AppSettings";
import { Button, Flex, Text } from "@radix-ui/themes";
import { motion } from "framer-motion";

interface Props {
  playerAnimations: PlayerAnimations;
  splitAnimations: SplitAnimations;
  dealerAnimations: DealerAnimations;
  overlayAnimations: OverlayAnimations;
  setOverlayValue: (result: string) => void;
  playCardSound: () => void;
}

interface SplitAnimations {
  splitEnterAnimation: () => Promise<void>;
  splitExitAnimation: () => Promise<void>;
}

interface PlayerAnimations {
  playerEnterAnimation: () => Promise<void>;
  playerExitAnimation: () => Promise<void>;
  playerSplitAnimation: () => Promise<void>;
  playerInitAnimation: () => Promise<void>;
}

interface DealerAnimations {
  dealerEnterAnimation: () => Promise<void>;
  dealerExitAnimation: () => Promise<void>;
  enterFlipAnimation: () => Promise<void>;
  exitFlipAnimation: () => Promise<void>;
  dealerInitAnimation: () => Promise<void>;
}

interface OverlayAnimations {
  showOverlay: () => Promise<void>;
  hideOverlay: () => Promise<void>;
}

export default function Controls({
  playerAnimations,
  splitAnimations,
  dealerAnimations,
  overlayAnimations,
  setOverlayValue,
  playCardSound,
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
  }, []);

  useEffect(() => {
    if (
      snapshot.playerHand.hand.cards.length > 2 ||
      snapshot.splitHand.hand.status === Status.Standing ||
      snapshot.splitHand.hand.status === Status.Win ||
      snapshot.splitHand.hand.status === Status.Bust
    )
      playerAnimations.playerEnterAnimation();
  }, [snapshot.playerHand.hand.cards.length, snapshot.splitHand.hand.status]);

  useEffect(() => {
    if (snapshot.dealerHand.hand.cards.length > 2) dealerAnimations.dealerEnterAnimation();
  }, [snapshot.dealerHand.hand.cards.length]);

  useEffect(() => {
    if (snapshot.splitHand.hand.cards.length > 0) splitAnimations.splitEnterAnimation();
  }, [snapshot.splitHand.hand.cards.length]);

  async function playAnimations() {
    playCardSound();
    await playerAnimations.playerInitAnimation();
    playCardSound();
    await dealerAnimations.dealerInitAnimation();
    playCardSound();
    await playerAnimations.playerEnterAnimation();
    playCardSound();
    await dealerAnimations.dealerEnterAnimation();
    await handleBlackjacks();
    setEnableControls(true);
  }

  function hit() {
    if (state.splitHand.hand.status === Status.Playing) hitSplitHand();
    else hitPlayerHand();
  }

  async function hitPlayerHand() {
    playCardSound();
    state.playerHand.hand.addRandom();
    // state.playerHand.hand.addToHand(two_card);
    await playerAnimations.playerEnterAnimation();
    if (state.playerHand.hand.getSum().hardTotal > 21) {
      state.playerHand.hand.status = Status.Bust;
      if (state.splitHand.hand.status === Status.Standing) {
        await displayOverlay("Bust!");
        stand();
      }
      // End round if player busts and splithand is a blackjack
      else if (state.splitHand.hand.status === Status.Win) {
        await dealerFlip();
        state.dealerHand.hand.status = Status.Loss;
        await handleNewRound("Bust!");
      }
      // Else player loses, end round
      else {
        await dealerFlip();
        state.dealerHand.hand.status = Status.Win;
        await handleNewRound("Bust!");
      }
    }
  }

  async function hitSplitHand() {
    playCardSound();
    state.splitHand.hand.addRandom();
    await splitAnimations.splitEnterAnimation();
    if (state.splitHand.hand.getSum().hardTotal > 21) {
      state.splitHand.hand.status = Status.Bust;
      await displayOverlay("Bust!");
      state.playerHand.hand.status = Status.Playing;
      state.playerHand.hand.addRandom();
      await playerAnimations.playerEnterAnimation();
      // Check if playerhand gets a blackjack after splithand busts
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        state.playerHand.hand.status = Status.Win;
        await displayOverlay("Blackjack!");
        stand();
      }
    }
  }

  async function stand() {
    if (state.splitHand.hand.status === Status.Playing) {
      state.splitHand.hand.status = Status.Standing;
      state.playerHand.hand.status = Status.Playing;
      playCardSound();
      state.playerHand.hand.addRandom();
      await playerAnimations.playerEnterAnimation();
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
        state.dealerHand.hand.getSum().softTotal < (state.standSeventeen ? 17 : 18) ||
        (state.dealerHand.hand.getSum().softTotal > 21 && state.dealerHand.hand.getSum().hardTotal < 17)
      ) {
        playCardSound();
        state.dealerHand.hand.addRandom();
        await dealerAnimations.dealerEnterAnimation();
      }
      state.dealerHand.hand.status = Status.Standing;
      // Check for dealer bust
      if (state.dealerHand.hand.getSum().hardTotal > 21) {
        if (state.splitHand.hand.status === Status.Standing) {
          state.splitHand.hand.status = Status.Win;
          await displayOverlay("Win!");
        }
        if (state.playerHand.hand.status === Status.Standing) {
          state.playerHand.hand.status = Status.Win;
          state.dealerHand.hand.status = Status.Loss;
          await displayOverlay("Win!");
        }
        await handleNewRound();
      } else {
        const dSum =
          state.dealerHand.hand.getSum().softTotal <= 21
            ? state.dealerHand.hand.getSum().softTotal
            : state.dealerHand.hand.getSum().hardTotal;
        // Compare splithand if not already blackjack/busted
        if (state.splitHand.hand.status === Status.Standing) {
          const sSum =
            state.splitHand.hand.getSum().softTotal <= 21
              ? state.splitHand.hand.getSum().softTotal
              : state.splitHand.hand.getSum().hardTotal;
          if (sSum > dSum) {
            state.splitHand.hand.status = Status.Win;
            await displayOverlay("Win!");
          } else if (sSum < dSum) {
            state.splitHand.hand.status = Status.Loss;
            await displayOverlay("Loss!");
          } else {
            state.splitHand.hand.status = Status.Push;
            await displayOverlay("Push!");
          }
        }
        // Compare playerhand if not already blackjack/busted
        if (state.playerHand.hand.status === Status.Standing) {
          const pSum =
            state.playerHand.hand.getSum().softTotal <= 21
              ? state.playerHand.hand.getSum().softTotal
              : state.playerHand.hand.getSum().hardTotal;
          if (pSum > dSum) {
            state.playerHand.hand.status = Status.Win;
            state.dealerHand.hand.status = Status.Loss;
            await handleNewRound("Win!");
          } else if (pSum < dSum) {
            state.playerHand.hand.status = Status.Loss;
            state.dealerHand.hand.status = Status.Win;
            await handleNewRound("Loss!");
          } else {
            state.playerHand.hand.status = Status.Push;
            state.dealerHand.hand.status = Status.Push;
            await handleNewRound("Push!");
          }
        } else await handleNewRound();
      }
    }
  }

  async function dealerFlip() {
    playCardSound();
    await dealerAnimations.exitFlipAnimation();
    state.dealerHand.hand.cards.pop();
    state.dealerHand.hand.addToHand(state.dealerHand._holeCard);
    await dealerAnimations.enterFlipAnimation();
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
    await playerAnimations.playerSplitAnimation();
    state.playerHand.removeEnd();
    playCardSound();
    await splitAnimations.splitEnterAnimation();
    state.splitHand.hand.addRandom();
    playCardSound();
    await splitAnimations.splitEnterAnimation();
    state.splitHand.bet = state.playerHand.bet;
    // Check for blackjack immediately after splitting
    state.splitHand.checkBlackjack();
    if (state.splitHand.blackjack) {
      state.splitHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Playing;
      await displayOverlay("Blackjack!");
      playCardSound();
      state.playerHand.hand.addRandom();
      await playerAnimations.playerEnterAnimation();
      // Check for double blackjack
      state.playerHand.checkBlackjack();
      if (state.playerHand.blackjack) {
        await timeout(AppSettings.BLACKJACK_DELAY);
        await dealerFlip();
        state.playerHand.hand.status = Status.Win;
        state.dealerHand.hand.status = Status.Loss;
        await handleNewRound("Blackjack!");
      }
    }
  }

  async function handleBlackjacks() {
    // Handle Blackjack at game start
    const pBlackjack = state.playerHand.checkBlackjack();
    const dBlackjack = state.dealerHand.checkBlackjack();
    if (pBlackjack && !dBlackjack) {
      await timeout(AppSettings.BLACKJACK_DELAY);
      await dealerFlip();
      state.dealerHand.hand.status = Status.Loss;
      state.playerHand.hand.status = Status.Win;
      await handleNewRound("Blackjack!");
    } else if (!pBlackjack && dBlackjack) {
      await timeout(AppSettings.BLACKJACK_DELAY);
      await dealerFlip();
      state.dealerHand.hand.status = Status.Win;
      state.playerHand.hand.status = Status.Loss;
      await handleNewRound("Loss!");
    } else if (pBlackjack && dBlackjack) {
      await timeout(AppSettings.BLACKJACK_DELAY);
      await dealerFlip();
      state.dealerHand.hand.status = Status.Push;
      state.playerHand.hand.status = Status.Push;
      await handleNewRound("Push!");
    }
  }

  async function handleNewRound(result?: string) {
    if (result) await displayOverlay(result);
    playerAnimations.playerExitAnimation();
    if (state.splitHand.hand.cards.length > 0) splitAnimations.splitExitAnimation();
    await dealerAnimations.dealerExitAnimation();
    resetRound();
  }

  async function displayOverlay(text: string) {
    await timeout(AppSettings.OVERLAY_DELAY);
    await setOverlayValue(text);
    await overlayAnimations.showOverlay();
    await timeout(AppSettings.OVERLAY_DURATION);
    await overlayAnimations.hideOverlay();
  }

  async function resetRound() {
    handleEarnings();
    state.dealerHand.resetHand();
    state.playerHand.resetHand();
    state.splitHand.resetHand();
    state.bet = 0;
    state.buffer = 0;
    if (state.bank <= 0) state.gameState = GameState.Gameover;
    else {
      if (state.shoe.length < AppSettings.SHUFFLE_WHEN) {
        handleShuffle();
        await displayOverlay("Shuffling Cards...");
      }
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

  const timeout = (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

  const canSplit =
    snapshot.splitHand.hand.status === Status.Standby &&
    snapshot.playerHand.hand.cards.length === 2 &&
    snapshot.playerHand.hand.cards[0].value === snapshot.playerHand.hand.cards[1].value &&
    snapshot.bank >= snapshot.bet * 2;

  const canDouble =
    (snapshot.playerHand.hand.status === Status.Playing &&
      snapshot.playerHand.hand.cards.length === 2 &&
      snapshot.playerHand.bet * 2 + snapshot.splitHand.bet <= snapshot.bank) ||
    (snapshot.splitHand.hand.status === Status.Playing &&
      snapshot.splitHand.hand.cards.length === 2 &&
      snapshot.splitHand.bet * 2 + snapshot.playerHand.bet <= snapshot.bank);

  return (
    <div>
      {enableControls &&
        (snapshot.playerHand.hand.status === Status.Playing || snapshot.splitHand.hand.status === Status.Playing) && (
          <Flex justify="center" gap="6">
            <Button style={{ cursor: "pointer" }} variant="ghost" radius="large" onClick={() => handleHit()} asChild>
              <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
                <Text size="6">Hit</Text>
              </motion.button>
            </Button>
            <Button
              style={{ cursor: "pointer" }}
              variant="ghost"
              radius="large"
              onClick={() => handleStanding()}
              asChild
            >
              <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
                <Text size="6">Stand</Text>
              </motion.button>
            </Button>
            {canDouble && (
              <Button
                style={{ cursor: "pointer" }}
                variant="ghost"
                radius="large"
                onClick={() => handleDouble()}
                asChild
              >
                <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
                  <Text size="6">Double</Text>
                </motion.button>
              </Button>
            )}
            {canSplit && (
              <Button
                style={{ cursor: "pointer" }}
                variant="ghost"
                radius="large"
                onClick={() => handleSplit()}
                asChild
              >
                <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
                  <Text size="6">Split</Text>
                </motion.button>
              </Button>
            )}
          </Flex>
        )}
    </div>
  );
}

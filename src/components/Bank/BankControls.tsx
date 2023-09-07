import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Status } from "../../utilities/hands";
import { animate, motion } from "framer-motion";
import { Button, Flex, Text } from "@radix-ui/themes";
import five_chip from "../../assets/chips/5chip.svg";
import twenty_five_chip from "../../assets/chips/25chip.svg";
import fifty_chip from "../../assets/chips/50chip.svg";
import one_hundred_chip from "../../assets/chips/100chip.svg";
import five_hundred_chip from "../../assets/chips/500chip.svg";
import one_thousand_chip from "../../assets/chips/1000chip.svg";
import five_thousand_chip from "../../assets/chips/5000chip.svg";

interface Props {
  exitAnimation: () => Promise<void>;
  playCoinSound: () => void;
}

export default function BankControls({ exitAnimation, playCoinSound }: Props) {
  const snapshot = useSnapshot(state);

  const handleSubmit = () => {
    submitBet();
  };

  const handleChangeBet = (amount: number) => {
    if (state.bet + amount <= state.bank) {
      playCoinSound();
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
    if (snapshot.bet > 0) {
      state.playerHand.bet = state.bet;
      await exitAnimation();
      state.gameState = GameState.Playing;
      initGame();
    }
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
    <Flex direction="column" align="center" gap="6">
      <Flex gap="2">
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={five_chip}
          onClick={() => handleChangeBet(5)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={twenty_five_chip}
          onClick={() => handleChangeBet(25)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={fifty_chip}
          onClick={() => handleChangeBet(50)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={one_hundred_chip}
          onClick={() => handleChangeBet(100)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={five_hundred_chip}
          onClick={() => handleChangeBet(500)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={one_thousand_chip}
          onClick={() => handleChangeBet(1000)}
        />
        <motion.img
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.01 }}
          animate={{ scale: 1 }}
          src={five_thousand_chip}
          onClick={() => handleChangeBet(5000)}
        />
      </Flex>
      <Flex gap="9">
        <Button style={{ cursor: "pointer" }} variant="ghost" onClick={() => handleResetBet()}>
          <Text weight="medium" size="6">
            Reset
          </Text>
        </Button>
        <Button
          style={{ cursor: "pointer" }}
          variant="ghost"
          onClick={() => handleChangeBet(snapshot.bank - snapshot.bet)}
        >
          <Text weight="medium" size="6" asChild>
            <motion.span
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            >
              All in! 🤑
            </motion.span>
          </Text>
        </Button>
        <Button style={{ cursor: "pointer" }} variant="ghost" id="submit" onClick={() => handleSubmit()}>
          <Text weight="medium" size="6">
            Bet!
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
}

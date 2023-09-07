import { useEffect } from "react";
import { GameState, state } from "../../store/store";
import { motion, useAnimate } from "framer-motion";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { AppSettings } from "../../utilities/AppSettings";

export default function StartMenu() {
  const [scope, animate] = useAnimate();

  const enterAnimation = async () => {
    animate("h1", { scale: 4 }, { duration: 1 });
    animate("h1", { rotate: [10, -10, 10] }, { duration: 3, ease: "easeInOut", repeat: Infinity });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.01 }, { duration: AppSettings.TITLE_EXIT_SPEED });
    await animate("button", { opacity: 0 }, { duration: AppSettings.TITLE_EXIT_SPEED });
  };

  useEffect(() => {
    enterAnimation();
  });

  const handleGameStart = async () => {
    for (let i = 0; i < 10; i++) {
      state.shoe = state.shoe
        .map((card) => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }
    await exitAnimation();
    state.gameState = GameState.Betting;
  };

  return (
    <Flex direction="column" align="center" ref={scope}>
      <Heading style={{ marginBottom: "10rem" }}>Blackjack!</Heading>
      <Flex direction="column" align="start" gap="9">
        <Button style={{ cursor: "pointer" }} variant="ghost" radius="large" onClick={() => handleGameStart()} asChild>
          <motion.button whileHover={{ scale: 1.2, originX: 0 }}>
            <Text size="8">Play!</Text>
          </motion.button>
        </Button>
        <Button variant="ghost" radius="large" asChild>
          <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
            <Text size="3">How to Play</Text>
          </motion.button>
        </Button>
        <Button variant="ghost" radius="large" asChild>
          <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
            <Text size="3">Settings</Text>
          </motion.button>
        </Button>
      </Flex>
    </Flex>
  );
}

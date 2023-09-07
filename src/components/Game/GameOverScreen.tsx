import { useAnimate, motion } from "framer-motion";
import { GameState, state } from "../../store/store";
import { useEffect } from "react";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { AppSettings } from "../../utilities/AppSettings";

export default function GameOver() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    enterAnimation();
  });

  const enterAnimation = async () => {
    animate("h1", { scale: 4 });
    animate("button", { scale: 1 });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.01 }, { duration: AppSettings.GAMEOVER_EXIT_SPEED });
    await animate("button", { scale: 0.1 }, { duration: AppSettings.GAMEOVER_EXIT_SPEED });
  };

  const handleRestart = async () => {
    await exitAnimation();
    state.gameState = GameState.Menu;
    state.bank = AppSettings.STARTING_MONEY;
    state.shoe = [...state.shoe, ...state.discarded];
    state.discarded = [];
  };

  return (
    <Flex direction="column" ref={scope}>
      <Heading mb="9">Game Over!</Heading>
      <Button
        style={{ cursor: "pointer" }}
        mt="9"
        variant="ghost"
        radius="large"
        onClick={() => handleRestart()}
        asChild
      >
        <motion.button whileHover={{ scale: 1.1 }}>
          <Text size="3">Restart</Text>
        </motion.button>
      </Button>
    </Flex>
  );
}

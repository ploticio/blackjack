import { useEffect } from "react";
import { GameState, state } from "../../store/store";
import { motion, useAnimate } from "framer-motion";
import { Blockquote, Box, Button, Em, Flex, Heading, Popover, ScrollArea, Text } from "@radix-ui/themes";
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

        <Popover.Root>
          <Popover.Trigger>
            <Button variant="ghost" radius="large" asChild>
              <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
                <Text size="3">How to Play</Text>
              </motion.button>
            </Button>
          </Popover.Trigger>
          <Popover.Content style={{ width: "400px", height: "250px" }}>
            <ScrollArea>
              <Box>
                <Flex direction="column" gap="4" pr="2">
                  <Heading>How to Play</Heading>
                  <Blockquote>
                    In <Em>Blackjack!</Em>, everyone plays against the dealer. Your goal is to draw cards with a value
                    as close to <Em>21</Em> as possible without going over. A hand that goes over <Em>21</Em> is a bust.
                    Each player only has to beat the dealer's hand to win. You do this in one of two ways: 1: Have a
                    card total value greater than that of the dealer and not bust. 2: Win by default if the dealer
                    busts.
                  </Blockquote>
                  <Em>-www.vegashowto.com</Em>
                  <Text>
                    Face cards have a value of <Em>10</Em>, Aces may have either a value of <Em>1</Em> or <Em>11</Em>.
                    The computer will keep drawing cards until either it busts, or has a soft total of <Em>17</Em>{" "}
                    (where an ace in the hand counts as an <Em>11</Em>).
                  </Text>
                  <Text>
                    Both the player and the dealer starts with two cards. If your two cards sum to 21, congratulations!
                    You have a <Em>Blackjack!</Em> and will be paid an additional <Em>3:2</Em> odds on your bet.
                    However, if the dealer has a <Em>Blackjack!</Em>, you lose will lose immediately unless you have a{" "}
                    <Em>Blackjack!</Em> too.
                  </Text>

                  <Text>
                    You have the ability to double your bet at the beginning of each round in return for drawing a
                    single card and standing. You may also split your hand into two hands at the beginning of the round
                    if the value of both your cards are equal.
                  </Text>
                </Flex>
              </Box>
            </ScrollArea>
          </Popover.Content>
        </Popover.Root>

        <Button variant="ghost" radius="large" asChild>
          <motion.button whileHover={{ scale: 1.1, originX: 0 }}>
            <Text size="3">Settings</Text>
          </motion.button>
        </Button>
      </Flex>
    </Flex>
  );
}

import BankControls from "./BankControls";
import BankDisplay from "./BankDisplay";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import { Button, Flex } from "@radix-ui/themes";
import { GameState, state } from "../../store/store";
import { AppSettings } from "../../utilities/AppSettings";

export default function BankUI({ playCoinSound }: { playCoinSound: () => void }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    enterAnimation();
  });

  const enterAnimation = async () => {
    animate("h1", { scale: 3 });
    animate("button", { scale: 1 });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.1 });
    animate("img", { scale: 0.1 });
    await animate("button", { scale: 0.1 });
  };

  const handleQuit = () => {
    state.gameState = GameState.Menu;
    state.bank = AppSettings.STARTING_MONEY;
    state.bet = 0;
    state.buffer = 0;
    state.shoe = [];
    state.discarded = [];
  };

  return (
    <>
      <Button variant="soft" style={{ position: "fixed", right: "8px", top: "8px" }} onClick={() => handleQuit()}>
        Quit to Menu
      </Button>
      <Flex direction="column" gap="9" ref={scope}>
        <BankDisplay />
        <BankControls exitAnimation={exitAnimation} playCoinSound={playCoinSound} />
      </Flex>
    </>
  );
}

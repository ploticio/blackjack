import BankControls from "./BankControls";
import BankDisplay from "./BankDisplay";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import { Flex } from "@radix-ui/themes";

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

  return (
    <Flex direction="column" gap="9" ref={scope}>
      <BankDisplay />
      <BankControls exitAnimation={exitAnimation} playCoinSound={playCoinSound} />
    </Flex>
  );
}

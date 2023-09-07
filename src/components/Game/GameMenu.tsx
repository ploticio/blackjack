import { useAnimate } from "framer-motion";
import { AppSettings } from "../../utilities/AppSettings";
import { useEffect } from "react";
import Title from "./Title";
import StartMenu from "./StartMenu";

export default function GameMenu({ playMusic }: { playMusic: () => void }) {
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

  return (
    <div ref={scope}>
      <Title />
      <StartMenu exitAnimation={exitAnimation} playMusic={playMusic} />
    </div>
  );
}

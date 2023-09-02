import { useEffect } from "react";
import { GameState, state } from "../store/store";
import "../styles/StartMenu.css";
import { useAnimate } from "framer-motion";

export default function StartMenu() {
  const [scope, animate] = useAnimate();

  const enterAnimation = async () => {
    animate("h1", { scale: 100 }, { duration: 1 });
    animate("h1", { rotate: [10, -10, 10] }, { duration: 3, ease: "easeInOut", repeat: Infinity });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.01 }, { duration: 1 });
    await animate("button", { opacity: 0 }, { duration: 1 });
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
    <div ref={scope}>
      <h1 id="title">Blackjack!</h1>
      <button onClick={() => handleGameStart()}>Play!</button>
    </div>
  );
}

import { useAnimate } from "framer-motion";
import { GameState, state } from "../../store/store";
import { useEffect } from "react";
import "../../styles/GameOverScreen.css";

export default function GameOver() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    enterAnimation();
  });

  const enterAnimation = async () => {
    animate("h1", { scale: 100 });
    animate("button", { scale: 10 });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.01 }, { duration: 0.75 });
    await animate("button", { scale: 0.1 }, { duration: 0.75 });
  };

  const handleRestart = async () => {
    await exitAnimation();
    state.gameState = GameState.Menu;
    state.bank = 1000;
    state.shoe = [...state.shoe, ...state.discarded];
    state.discarded = [];
  };

  return (
    <div className="game-over" ref={scope}>
      <h1>Game Over!</h1>
      <button onClick={() => handleRestart()}>Restart</button>
    </div>
  );
}

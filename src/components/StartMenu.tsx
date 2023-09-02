import { useEffect } from "react";
import { GameState, state } from "../store/store";
import "../styles/StartMenu.css";
import { useAnimate } from "framer-motion";

export default function StartMenu() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const myAnimation = async () => {
      animate(scope.current, { scale: 100 }, { duration: 1 });
      animate(scope.current, { rotate: [10, -10, 10] }, { duration: 3, ease: "easeInOut", repeat: Infinity });
    };
    myAnimation();
  });

  const handleGameStart = () => {
    for (let i = 0; i < 10; i++) {
      state.shoe = state.shoe
        .map((card) => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }
    state.gameState = GameState.Betting;
  };

  return (
    <>
      <h1 id="title" ref={scope}>
        Blackjack!
      </h1>
      <button onClick={() => handleGameStart()}>Play!</button>
    </>
  );
}

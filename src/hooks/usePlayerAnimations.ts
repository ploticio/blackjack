import { useAnimate } from "framer-motion";
import { AnimationSettings } from "./AnimationSettings";

export default function usePlayerAnimations() {
  const [scope, animate] = useAnimate();

  const playerEnterAnimation = async () => {
    await animate(
      ":last-child",
      { x: "75vw", y: "100vh" },
      { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED }
    );
  };

  const playerExitAnimation = async () => {
    await animate(
      "img",
      { y: "-100vh" },
      { type: "tween", duration: AnimationSettings.CARD_EXIT_SPEED, delay: AnimationSettings.ROUND_END_TIMER }
    );
  };

  const playerSplitAnimation = async () => {
    await animate(":last-child", { opacity: 0 }, { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED });
  };

  const playerInitAnimation = async () => {
    await animate(
      ":first-child",
      { x: "75vw", y: "100vh" },
      { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED }
    );
  };

  return {
    scope,
    playerEnterAnimation,
    playerExitAnimation,
    playerSplitAnimation,
    playerInitAnimation,
  };
}

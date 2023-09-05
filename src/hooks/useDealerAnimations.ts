import { useAnimate } from "framer-motion";
import { AnimationSettings } from "./AnimationSettings";

export default function useDealerAnimations() {
  const [scope, animate] = useAnimate();

  const dealerEnterAnimation = async () => {
    await animate(
      ":last-child",
      { x: "75vw", y: "100vh" },
      { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED }
    );
  };

  const dealerExitAnimation = async () => {
    await animate(
      "img",
      { y: "-100vh" },
      { type: "tween", duration: AnimationSettings.CARD_EXIT_SPEED, delay: AnimationSettings.ROUND_END_TIMER }
    );
  };

  const enterFlipAnimation = async () => {
    await animate(":last-child", { rotateY: 0 }, { duration: AnimationSettings.CARD_FLIP_SPEED });
  };
  const exitFlipAnimation = async () => {
    await animate(":last-child", { rotateY: -90 }, { duration: AnimationSettings.CARD_FLIP_SPEED - 0.05 });
  };

  const dealerInitAnimation = async () => {
    await animate(
      ":first-child",
      { x: "75vw", y: "100vh" },
      { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED }
    );
  };

  return {
    scope,
    dealerEnterAnimation,
    dealerExitAnimation,
    dealerInitAnimation,
    enterFlipAnimation,
    exitFlipAnimation,
  };
}

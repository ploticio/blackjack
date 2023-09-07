import { useAnimate } from "framer-motion";
import { AppSettings } from "../utilities/AppSettings";

export default function useDealerAnimations() {
  const [scope, animate] = useAnimate();

  const dealerEnterAnimation = async () => {
    await animate(":last-child", { x: "75vw", y: "100vh" }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const dealerExitAnimation = async () => {
    await animate(
      "img",
      // { x: "-75vw", y: "-100vh" },
      { scale: 0.01 },
      { type: "tween", duration: AppSettings.CARD_EXIT_SPEED, delay: AppSettings.ROUND_END_TIMER }
    );
  };

  const enterFlipAnimation = async () => {
    await animate(":last-child", { rotateY: 0 }, { duration: AppSettings.CARD_DRAW_SPEED / 2 - 0.05 });
  };
  const exitFlipAnimation = async () => {
    await animate(":last-child", { rotateY: -90 }, { duration: AppSettings.CARD_DRAW_SPEED / 2 });
  };

  const dealerInitAnimation = async () => {
    await animate(":first-child", { x: "75vw", y: "100vh" }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const dealerAnimations = {
    dealerEnterAnimation,
    dealerExitAnimation,
    enterFlipAnimation,
    exitFlipAnimation,
    dealerInitAnimation,
  };

  return {
    scope,
    dealerAnimations,
  };
}

import { useAnimate } from "framer-motion";
import { AnimationSettings } from "./AnimationSettings";

export default function useSplitAnimations() {
  const [scope, animate] = useAnimate();

  const splitEnterAnimation = async () => {
    await animate(
      ":last-child",
      { x: "75vw", y: "100vh" },
      { type: "tween", duration: AnimationSettings.CARD_DRAW_SPEED }
    );
  };

  const splitExitAnimation = async () => {
    await animate(
      "img",
      // { x: "-75vw", y: "-100vh" },
      { scale: 0.01 },
      { type: "tween", duration: AnimationSettings.CARD_EXIT_SPEED, delay: AnimationSettings.ROUND_END_TIMER }
    );
  };

  const splitAnimations = { splitEnterAnimation, splitExitAnimation };

  return { scope, splitAnimations };
}

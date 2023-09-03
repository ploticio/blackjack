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
      { y: "-100vh" },
      { type: "tween", duration: AnimationSettings.CARD_EXIT_SPEED, delay: AnimationSettings.ROUND_END_TIMER }
    );
  };

  return { scope, splitEnterAnimation, splitExitAnimation };
}

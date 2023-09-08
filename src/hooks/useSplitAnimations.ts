import { useAnimate } from "framer-motion";
import { AppSettings } from "../utilities/AppSettings";

export default function useSplitAnimations() {
  const [scope, animate] = useAnimate();

  const splitEnterAnimation = async () => {
    await animate(":last-child", { x: "75vw", y: "100vh" }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const splitExitAnimation = async () => {
    await animate(
      "img",
      // { x: "-75vw", y: "-100vh" },
      { scale: 0.01 },
      { type: "tween", duration: AppSettings.CARD_EXIT_SPEED, delay: AppSettings.ROUND_END_TIMER }
    );
  };

  const splitFadeOutAnimation = async () => {
    animate("img", { zIndex: -1 });
    await animate("img", { opacity: 0.3 }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const splitFadeInAnimation = async () => {
    await animate("img", { opacity: 1 }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const splitAnimations = { splitEnterAnimation, splitExitAnimation, splitFadeOutAnimation, splitFadeInAnimation };

  return { scope, splitAnimations };
}

import { useAnimate } from "framer-motion";
import { AppSettings } from "../utilities/AppSettings";

export default function usePlayerAnimations() {
  const [scope, animate] = useAnimate();

  const playerEnterAnimation = async () => {
    await animate(":last-child", { x: "75vw", y: "100vh" }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const playerExitAnimation = async () => {
    await animate(
      "img",
      // { x: "-75vw", y: "-100vh" },
      { scale: 0.01 },
      { type: "tween", duration: AppSettings.CARD_EXIT_SPEED, delay: AppSettings.ROUND_END_TIMER }
    );
  };

  const playerFadeOutAnimation = async () => {
    await animate("img", { opacity: 0.3 }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const playerFadeInAnimation = async () => {
    animate("img", { opacity: 1 }, { duration: AppSettings.OVERLAY_SPEED });
    await animate("img", { opacity: 1 }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const playerSplitAnimation = async () => {
    await animate(":last-child", { opacity: 0 }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const playerInitAnimation = async () => {
    await animate(":first-child", { x: "75vw", y: "100vh" }, { type: "tween", duration: AppSettings.CARD_DRAW_SPEED });
  };

  const playerAnimations = {
    playerEnterAnimation,
    playerExitAnimation,
    playerSplitAnimation,
    playerInitAnimation,
    playerFadeOutAnimation,
    playerFadeInAnimation,
  };

  return {
    scope,
    playerAnimations,
  };
}

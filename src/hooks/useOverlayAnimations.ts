import { useAnimate } from "framer-motion";
import { AppSettings } from "../utilities/AppSettings";

export default function useOverlayAnimations() {
  const [scope, animate] = useAnimate();

  const showOverlay = async () => {
    animate(scope.current, { zIndex: 1 });
    animate("h1", { opacity: 1 });
    await animate(scope.current, { backgroundColor: "rgba(0,0,0,0.4)" }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const hideOverlay = async () => {
    animate(scope.current, { zIndex: -1 });
    animate("h1", { opacity: 0 });
    await animate(scope.current, { backgroundColor: "rgba(0,0,0,0)" }, { duration: AppSettings.OVERLAY_SPEED });
  };

  const overlayAnimations = { showOverlay, hideOverlay };

  return { scope, overlayAnimations };
}

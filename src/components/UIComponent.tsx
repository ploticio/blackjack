import { useStore } from "../store/store";
import ControlsComponent from "./ControlsComponent";
import StartMenu from "./StartMenu";

export default function UIComponent() {
  const startScreen = useStore((state) => state.startScreen);

  return <>{startScreen ? <StartMenu /> : <ControlsComponent />}</>;
}

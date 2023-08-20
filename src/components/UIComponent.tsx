import { useStore, Status } from "../store/store";
import CardHandsComponent from "./CardHandsComponent";
import Controls from "./Controls";
import Outcome from "./Outcome";
import StartMenu from "./StartMenu";

export default function UIComponent() {
  const status = useStore((state) => state.status);
  const ifOutcome = status === Status.Win || status === Status.Loss || status === Status.Push;

  return (
    <>
      {ifOutcome && <Outcome />}
      {status === Status.Menu ? <h1>Blackjack!</h1> : <CardHandsComponent />}
      {status === Status.Menu ? <StartMenu /> : <Controls />}
    </>
  );
}

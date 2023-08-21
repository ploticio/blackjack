import { useStore, Status } from "../store/store";
import StartMenu from "./StartMenu";
import GameUI from "./Game/GameUI";
import BankUI from "./Bank/BankUI";

export default function UIComponent() {
  const status = useStore((state) => state.status);

  const showUI = () => {
    switch (status) {
      case Status.Menu:
        return (
          <>
            <h1>Blackjack!</h1>
            <StartMenu />
          </>
        );
      case Status.Betting:
        return <BankUI />;
      default:
        return (
          <>
            <GameUI />
          </>
        );
    }
  };

  return showUI();
}

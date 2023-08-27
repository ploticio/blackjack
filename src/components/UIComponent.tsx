import StartMenu from "./StartMenu";
import GameUI from "./Game/GameUI";
import BankUI from "./Bank/BankUI";
import { useSnapshot } from "valtio";
import { state, GameState } from "../store/store";

export default function UIComponent() {
  const snapshot = useSnapshot(state);

  const showUI = () => {
    switch (snapshot.gameState) {
      case GameState.Menu:
        return (
          <>
            <h1>Blackjack!</h1>
            <StartMenu />
          </>
        );
      case GameState.Betting:
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

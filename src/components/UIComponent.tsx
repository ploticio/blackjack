import StartMenu from "./StartMenu";
import GameUI from "./Game/GameUI";
import BankUI from "./Bank/BankUI";
import { useSnapshot } from "valtio";
import { state, GameState } from "../store/store";
import GameOver from "./Game/GameOverScreen";

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
      case GameState.Gameover:
        return <GameOver />;
      default:
        return <GameUI />;
    }
  };

  return showUI();
}

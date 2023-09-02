import { GameState, state } from "../store/store";

export default function GameOver() {
  const handleRestart = () => {
    state.gameState = GameState.Menu;
    state.bank = 1000;
    state.shoe = [...state.shoe, ...state.discarded];
    state.discarded = [];
  };

  return (
    <div>
      <h1>Game Over!</h1>
      <button onClick={() => handleRestart()}>Restart</button>
    </div>
  );
}

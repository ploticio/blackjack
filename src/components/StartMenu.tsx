import { GameState, state } from "../store/store";

export default function StartMenu() {
  const handleGameStart = () => {
    for (let i = 0; i < 10; i++) {
      state.shoe = state.shoe
        .map((card) => ({ card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }
    state.gameState = GameState.Betting;
  };

  return (
    <>
      <button onClick={() => handleGameStart()}>Play!</button>
    </>
  );
}

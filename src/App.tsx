import "./App.css";
import { useEffect } from "react";
import { useStore } from "./store/store";
import HandComponent from "./components/HandComponent";
import { Card } from "./utilities/cards";

function App() {
  const deck = useStore((state) => state.shoe);
  const shuffle = useStore((state) => state.shuffle);
  const sample = useStore((state) => state.sample);
  const playerHand = useStore((state) => state.playerHand);
  const addToPlayer = useStore((state) => state.addToPlayer);

  const handleShuffle = () => {
    shuffle();
  };

  const handleSample = () => {
    addToPlayer(sample());
  };

  return (
    <div className="App">
      <h1>{deck.length}</h1>
      <HandComponent cards={playerHand} />
      <button onClick={() => handleShuffle()}>Shuffle</button>
      <button onClick={() => handleSample()}>Sample</button>
    </div>
  );
}

export default App;

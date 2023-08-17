import "./App.css";
import CardComponent from "./components/CardComponent";
import { deck } from "./utilities/cards";

function App() {
  const myCard = deck[0];
  return (
    <div className="App">
      <CardComponent card={myCard} />
    </div>
  );
}

export default App;

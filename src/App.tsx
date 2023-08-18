import "./App.css";
import CardComponent from "./components/CardComponent";
import { deck } from "./utilities/cards";

function App() {
  return (
    <div className="App">
      <div className="hand">
        <CardComponent card={deck[0]} />
        <CardComponent card={deck[10]} />
      </div>
      <div className="hand">
        <CardComponent card={deck[1]} />
        <CardComponent card={deck[2]} />
      </div>
    </div>
  );
}

export default App;

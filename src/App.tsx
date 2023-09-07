import "./App.css";
import "@radix-ui/themes/styles.css";
import UIComponent from "./components/Game/UIComponent";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <Theme accentColor="gray" appearance="dark">
      <div className="App">
        <UIComponent />
      </div>
    </Theme>
  );
}

export default App;

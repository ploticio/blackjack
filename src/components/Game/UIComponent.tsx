import StartMenu from "./StartMenu";
import GameUI from "./GameUI";
import BankUI from "../Bank/BankUI";
import GameOver from "./GameOverScreen";
import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Flex, Link, Text } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function UIComponent() {
  const snapshot = useSnapshot(state);

  const showUI = () => {
    switch (snapshot.gameState) {
      case GameState.Menu:
        return <StartMenu />;
      case GameState.Betting:
        return <BankUI />;
      case GameState.Gameover:
        return <GameOver />;
      default:
        return <GameUI />;
    }
  };

  return (
    <div>
      {showUI()}
      <Link href="https://github.com/ploticio/blackjack" target="_blank" rel="noopener noreferrer">
        <Flex align="center" justify="center" style={{ position: "fixed", bottom: "2px", right: "4px" }}>
          <GitHubLogoIcon />
          <Text ml="1">Made by ploticio</Text>
        </Flex>
      </Link>
    </div>
  );
}

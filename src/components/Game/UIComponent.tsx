import GameMenu from "./GameMenu";
import GameUI from "./GameUI";
import BankUI from "../Bank/BankUI";
import GameOver from "./GameOverScreen";
import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Flex, Link, Text } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import card_sound from "../../assets/sounds/card-draw.wav";
import coin_sound from "../../assets/sounds/coin.mp3";

export default function UIComponent() {
  const snapshot = useSnapshot(state);

  const playCardSound = () => {
    new Audio(card_sound).play();
  };

  const playCoinSound = () => {
    new Audio(coin_sound).play();
  };

  const showUI = () => {
    switch (snapshot.gameState) {
      case GameState.Menu:
        return <GameMenu />;
      case GameState.Betting:
        return <BankUI playCoinSound={playCoinSound} />;
      case GameState.Gameover:
        return <GameOver />;
      default:
        return <GameUI playCardSound={playCardSound} />;
    }
  };

  return (
    <div>
      {showUI()}
      <Link href="https://github.com/ploticio/blackjack" target="_blank" rel="noopener noreferrer">
        <Flex align="center" justify="center" style={{ position: "fixed", bottom: "2px", right: "8px" }}>
          <GitHubLogoIcon />
          <Text ml="1">Made by ploticio</Text>
        </Flex>
      </Link>
    </div>
  );
}

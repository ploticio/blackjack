import GameMenu from "./GameMenu";
import GameUI from "./GameUI";
import BankUI from "../Bank/BankUI";
import GameOver from "./GameOverScreen";
import { useSnapshot } from "valtio";
import { state, GameState } from "../../store/store";
import { Flex, Link, Text } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import card_sound from "../../assets/sounds/card-draw.wav";
import coin_sound from "../../assets/sounds/coin.mp3";
import background_music from "../../assets/sounds/background-music.mp3";
import VolumeControl from "./VolumeControl";

const audioContext = new AudioContext();
const audioElement = new Audio(background_music);
const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();
track.connect(gainNode).connect(audioContext.destination);

export default function UIComponent() {
  const snapshot = useSnapshot(state);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const playCardSound = () => {
    new Audio(card_sound).play();
  };

  const playCoinSound = () => {
    new Audio(coin_sound).play();
  };

  const playMusic = () => {
    if (audioContext.state === "suspended") audioContext.resume();
    if (!musicPlaying) {
      setMusicPlaying(true);
      audioElement.play();
    }
  };

  const handleVolume = (value: number) => {
    gainNode.gain.value = value;
  };

  audioElement.addEventListener("ended", () => setMusicPlaying(false), false);

  const showUI = () => {
    switch (snapshot.gameState) {
      case GameState.Menu:
        return <GameMenu playMusic={playMusic} />;
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
      <VolumeControl handleVolume={handleVolume} />
      <Link href="https://github.com/ploticio/blackjack" target="_blank" rel="noopener noreferrer">
        <Flex align="center" justify="center" style={{ position: "fixed", bottom: "5px", right: "5px" }}>
          <GitHubLogoIcon />
          <Text id="credit-tag" ml="1">
            Made by ploticio
          </Text>
        </Flex>
      </Link>
    </div>
  );
}

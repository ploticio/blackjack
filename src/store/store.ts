import type {} from "@redux-devtools/extension";
import { devtools } from "valtio/utils";
import { proxy } from "valtio";
import { Card, deck } from "../utilities/cards";
import { DealerHand, PlayerHand } from "../utilities/hands";

export enum GameState {
  Menu = "Menu",
  Betting = "Betting",
  Playing = "Playing",
  Gameover = "Gameover",
}

interface IState {
  gameState: GameState;
  shoe: Card[];
  playerHand: PlayerHand;
  dealerHand: DealerHand;
  splitHand: PlayerHand;
  discarded: Card[];
  startScreen: boolean;
  bank: number;
  bet: number;
  buffer: number;
  showSums: boolean;
  numberDecks: number;
}

export const state = proxy<IState>({
  gameState: GameState.Menu,
  shoe: [],
  playerHand: new PlayerHand(),
  dealerHand: new DealerHand(),
  splitHand: new PlayerHand(),
  discarded: [],
  startScreen: true,
  bank: 500,
  bet: 0,
  buffer: 0,
  showSums: true,
  numberDecks: 4,
});

const unsub = devtools(state, { name: "myState", enabled: true });

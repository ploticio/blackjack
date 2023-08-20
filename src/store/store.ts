import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Card, deck } from "../utilities/cards";

export enum Status {
  Menu = "Menu",
  Playing = "Playing",
  Win = "Win!",
  Loss = "Loss!",
  Push = "Push!",
}

interface IState {
  shoe: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  discarded: Card[];
  bank: number;
  tempCard: Card;
  holeCardImg: string;
  playerStanding: boolean;
  status: Status;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
  addToDealer: (newCard: Card) => void;
  resetHands: () => void;
  setHoleImg: (img: string) => void;
  flipCard: () => void;
  setPlayerStanding: (value: boolean) => void;
  getPlayerSum: () => number;
  getDealerSum: () => number;
  setStatus: (status: Status) => void;
}

export const useStore = create<IState>()(
  immer((set, get) => ({
    shoe: [...deck, ...deck, ...deck, ...deck],
    playerHand: [],
    dealerHand: [],
    discarded: [],
    bank: 1000,
    tempCard: {} as Card,
    startScreen: true,
    holeCardImg: "",
    dealerBust: false,
    playerStanding: false,
    status: Status.Menu,

    shuffle: () => {
      set((state) => {
        state.shoe = state.shoe
          .map((card) => ({ card, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ card }) => card);
      });
    },

    sample: () => {
      set((state) => {
        if (state.shoe.length) {
          state.tempCard = state.shoe.pop()!;
        }
      });
      return get().tempCard;
    },

    addToPlayer: (newCard) => {
      set((state) => {
        state.playerHand.push(newCard);
      });
    },

    addToDealer: (newCard) => {
      set((state) => {
        state.dealerHand.push(newCard);
      });
    },

    resetHands: () => {
      console.log("reseting hands");
      set((state) => {
        state.discarded = [...state.discarded, ...state.playerHand, ...state.dealerHand];
        state.playerHand = [];
        state.dealerHand = [];
      });
    },

    setHoleImg: (img) => {
      set((state) => {
        state.holeCardImg = img;
      });
    },

    flipCard: () => {
      set((state) => {
        state.dealerHand[state.dealerHand.length - 1].image = state.holeCardImg;
      });
    },

    setPlayerStanding: (value) => {
      console.log(`Player is standing: ${value}`);
      set((state) => {
        state.playerStanding = value;
      });
    },

    getPlayerSum: () => {
      return get().playerHand.reduce((acc, card) => acc + card.value, 0);
    },

    getDealerSum: () => {
      return get().dealerHand.reduce((acc, card) => acc + card.value, 0);
    },

    setStatus: (status) => {
      console.log(`Setting status: ${status}`);
      set((state) => {
        state.status = status;
      });
    },
  }))
);

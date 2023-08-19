import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Card, deck } from "../utilities/cards";

interface IState {
  shoe: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  discarded: Card[];
  bank: number;
  tempCard: Card;
  startScreen: boolean;
  holeCardImg: string;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
  addToDealer: (newCard: Card) => void;
  resetHands: () => void;
  startGame: () => void;
  setHoleImg: (img: string) => void;
  flipCard: () => void;
}

export const useStore = create<IState>()(
  immer((set, get) => ({
    shoe: [...deck],
    playerHand: [],
    dealerHand: [],
    discarded: [],
    bank: 1000,
    tempCard: {} as Card,
    startScreen: true,
    holeCardImg: "",

    shuffle: () => {
      console.log("shuffle running");

      set((state) => {
        state.shoe = state.shoe
          .map((card) => ({ card, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ card }) => card);
      });
    },

    sample: () => {
      console.log("sample running");

      set((state) => {
        if (state.shoe.length) {
          state.tempCard = state.shoe.pop()!;
        }
      });
      return get().tempCard;
    },

    addToPlayer: (newCard) => {
      console.log("adding to player hand");
      set((state) => {
        state.playerHand.push(newCard);
      });
    },

    addToDealer: (newCard) => {
      console.log("adding to dealer hand");
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

    startGame: () => {
      set((state) => {
        state.startScreen = false;
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
  }))
);

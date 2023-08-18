import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Card, deck } from "../utilities/cards";

interface IState {
  shoe: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  discardPile: Card[];
  bank: number;
  tempCard: Card;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
}

export const useStore = create<IState>()(
  immer((set, get) => ({
    shoe: [...deck],
    playerHand: [],
    dealerHand: [],
    discardPile: [],
    bank: 1000,
    tempCard: {} as Card,

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
  }))
);

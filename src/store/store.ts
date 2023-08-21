import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Card, back_card, deck } from "../utilities/cards";

export enum Status {
  Menu = "Menu",
  Playing = "Playing",
  Win = "Win!",
  Loss = "Loss!",
  Push = "Push!",
}

interface Sum {
  hardTotal: number;
  softTotal: number;
}

interface IState {
  shoe: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  discarded: Card[];
  bank: number;
  tempCard: Card;
  playerStanding: boolean;
  status: Status;
  holeCard: Card;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
  addToDealer: (newCard: Card) => void;
  resetHands: () => void;
  flipCard: () => void;
  setPlayerStanding: (value: boolean) => void;
  getPlayerSum: () => Sum;
  getDealerSum: () => Sum;
  setStatus: (status: Status) => void;
  addHoleCard: () => void;
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
    holeCard: {} as Card,

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
      set((state) => {
        state.discarded = [...state.discarded, ...state.playerHand, ...state.dealerHand];
        state.playerHand = [];
        state.dealerHand = [];
      });
    },

    flipCard: () => {
      set((state) => {
        state.dealerHand[state.dealerHand.length - 1] = state.holeCard;
      });
    },

    setPlayerStanding: (value) => {
      set((state) => {
        state.playerStanding = value;
      });
    },

    getPlayerSum: () => {
      const hardTotal = get().playerHand.reduce((acc, card) => acc + card.value, 0);
      let softTotal = hardTotal;
      if (get().playerHand.some((card) => card.value === 1)) {
        softTotal = hardTotal + 10;
      }
      return {
        hardTotal,
        softTotal,
      };
    },

    getDealerSum: () => {
      const hardTotal = get().dealerHand.reduce((acc, card) => acc + card.value, 0);
      let softTotal = hardTotal;
      if (get().dealerHand.some((card) => card.value === 1)) {
        softTotal = hardTotal + 10;
      }
      return {
        hardTotal,
        softTotal,
      };
    },

    setStatus: (status) => {
      set((state) => {
        state.status = status;
      });
    },

    addHoleCard: () => {
      set((state) => {
        state.holeCard = state.sample();
        state.dealerHand.push({ ...back_card });
      });
    },
  }))
);

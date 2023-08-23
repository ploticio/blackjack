import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Card, back_card, deck } from "../utilities/cards";
import { devtools } from "zustand/middleware";

export enum Status {
  Menu = "Menu",
  Betting = "Betting",
  Playing = "Playing",
  Win = "Win!",
  Bust = "Bust!",
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
  tempCard: Card;
  playerStanding: boolean;
  status: Status;
  holeCard: Card;
  bank: number;
  bet: number;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
  addToP: () => void;
  addToD: () => void;
  addToDealer: (newCard: Card) => void;
  resetHands: () => void;
  flipCard: () => void;
  setPlayerStanding: (value: boolean) => void;
  getPlayerSum: () => Sum;
  getDealerSum: () => Sum;
  setStatus: (status: Status) => void;
  addHoleCard: () => void;
  changeBet: (betAmount: number) => void;
  getBet: () => number;
  changeBank: (amount: number) => void;
}

export const useStore = create<IState>()(
  immer(
    devtools((set, get) => ({
      shoe: [...deck, ...deck, ...deck, ...deck],
      playerHand: [],
      dealerHand: [],
      discarded: [],
      tempCard: {} as Card,
      startScreen: true,
      holeCardImg: "",
      dealerBust: false,
      playerStanding: false,
      status: Status.Menu,
      holeCard: {} as Card,
      bank: 1000,
      bet: 0,

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

      addToP: () => {
        set((state) => {
          if (state.shoe.length) {
            const temp = state.shoe.pop()!;
            state.playerHand.push(temp);
          }
        });
      },

      addToDealer: (newCard) => {
        set((state) => {
          state.dealerHand.push(newCard);
        });
      },

      addToD: () => {
        set((state) => {
          if (state.shoe.length) {
            const temp = state.shoe.pop()!;
            state.dealerHand.push(temp);
          }
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
          if (state.shoe.length) {
            state.holeCard = state.shoe.pop()!;
          }
          state.dealerHand.push({ ...back_card });
        });
      },

      changeBet: (betAmount) => {
        set((state) => {
          state.bet += betAmount;
        });
      },

      getBet: () => get().bet,

      changeBank: (amount) => {
        set((state) => {
          state.bank += amount;
        });
      },
    }))
  )
);

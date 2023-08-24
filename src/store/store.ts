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
  status: Status;
  holeCard: Card;
  bank: number;
  bet: number;

  shuffle: () => void;
  sample: () => Card;
  addToPlayer: (newCard: Card) => void;
  addToDealer: (newCard: Card) => void;
  resetHands: () => void;
  flipCard: () => void;
  getPlayerSum: () => Sum;
  getDealerSum: () => Sum;
  setStatus: (status: Status) => void;
  addHoleCard: () => void;
  changeBet: (betAmount: number) => void;
  changeBank: (amount: number) => void;
  checkBlackjack: () => void;
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
      dealerBust: false,
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

      changeBank: (amount) => {
        set((state) => {
          state.bank += amount;
        });
      },

      checkBlackjack: () => {
        const pBlackjack = get().getPlayerSum().softTotal === 21 ? true : false;
        const dBlackjack =
          (get().dealerHand[0].value === 1 && get().holeCard.value === 10) ||
          (get().dealerHand[0].value === 10 && get().holeCard.value === 1)
            ? true
            : false;
        if (pBlackjack && !dBlackjack) {
          get().flipCard();
          get().setStatus(Status.Win);
          get().changeBank(0.5 * get().bet);
        } else if (!pBlackjack && dBlackjack) {
          get().flipCard();
          get().setStatus(Status.Loss);
        } else if (pBlackjack && dBlackjack) {
          get().flipCard();
          get().setStatus(Status.Push);
        }
      },
    }))
  )
);

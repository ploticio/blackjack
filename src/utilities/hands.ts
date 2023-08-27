import { state } from "../store/store";
import { Card, back_card } from "./cards";

export enum Status {
  Playing = "Playing",
  Standing = "Standing",
  Win = "Win!",
  Bust = "Bust!",
  Loss = "Loss!",
  Push = "Push!",
}

export class Hand {
  cards: Card[];
  _status: Status;

  constructor() {
    this.cards = [];
    this._status = Status.Playing;
  }

  set status(status: Status) {
    this._status = status;
  }

  get status() {
    return this._status;
  }

  getSum() {
    const hardTotal = this.cards.reduce((acc, card) => acc + card.value, 0);
    let softTotal = hardTotal;
    if (this.cards.some((card) => card.value === 1)) {
      softTotal = hardTotal + 10;
    }
    return {
      hardTotal,
      softTotal,
    };
  }

  addRandom() {
    this.cards.push(sample());
  }

  addToHand(card: Card) {
    this.cards.push(card);
  }

  removeEnd() {
    if (this.cards.length) {
      return this.cards.pop()!;
    }
    return {} as Card;
  }

  resetHand() {
    state.discarded = [...state.discarded, ...this.cards];
    this.cards = [];
    this.status = Status.Playing;
  }
}

export class DealerHand {
  hand: Hand;
  _holeCard: Card;
  _blackjack: boolean;

  constructor() {
    this.hand = new Hand();
    this._holeCard = { ...back_card };
    this._blackjack = false;
  }

  addHoleCard(card?: Card) {
    if (card) this._holeCard = card;
    else {
      if (state.shoe.length) {
        this._holeCard = state.shoe.pop()!;
      }
    }
    this.hand.cards.push({ ...back_card });
  }

  flipCard() {
    this.hand.cards[this.hand.cards.length - 1] = this._holeCard;
  }

  resetHand() {
    this.hand.resetHand();
    this._holeCard = { ...back_card };
    this._blackjack = false;
  }

  checkBlackjack() {
    if (
      this.hand.cards.length === 2 &&
      ((this.hand.cards[0].value === 1 && this._holeCard.value === 10) ||
        (this.hand.cards[0].value === 10 && this._holeCard.value === 1))
    ) {
      this._blackjack = true;
    }
  }

  get blackjack() {
    return this._blackjack;
  }
}

export class PlayerHand {
  hand: Hand;
  _bet: number;
  _blackjack: boolean;

  constructor() {
    this.hand = new Hand();
    this._bet = 0;
    this._blackjack = false;
  }

  set bet(amount: number) {
    this._bet = amount;
  }

  get bet() {
    return this._bet;
  }

  resetHand() {
    this.hand.resetHand();
    this.bet = 0;
    this._blackjack = false;
  }

  checkBlackjack() {
    if (this.hand.cards.length === 2 && this.hand.getSum().softTotal == 21) this._blackjack = true;
  }

  get blackjack() {
    return this._blackjack;
  }
}

const sample = () => {
  if (state.shoe.length) {
    return state.shoe.pop()!;
  }
  return {} as Card;
};

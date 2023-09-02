import { AppSettings } from "../components/AppSettings";
import { state } from "../store/store";
import { Card, back_card } from "./cards";

export enum Status {
  Playing = "Playing",
  Standing = "Standing",
  Standby = "Standby",
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
    this._status = Status.Standby;
  }

  set status(status: Status) {
    this._status = status;
  }

  get status(): Status {
    return this._status;
  }

  getSum(): { hardTotal: number; softTotal: number } {
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

  resetHand() {
    state.discarded = [...state.discarded, ...this.cards];
    this.cards = [];
    this.status = Status.Standby;
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
    this.hand.cards.pop();
    setTimeout(() => {
      this.hand.addToHand(this._holeCard);
    }, AppSettings.ADD_CARD_SPEED * 1000 - 250);
    setTimeout(() => {
      if (!this.blackjack) this.hand.status = Status.Playing;
    }, AppSettings.ADD_CARD_SPEED * 1000 + 500);
  }

  resetHand() {
    this.hand.resetHand();
    this._holeCard = { ...back_card };
    this._blackjack = false;
  }

  checkBlackjack(): boolean {
    if (
      this.hand.cards.length === 2 &&
      ((this.hand.cards[0].value === 1 && this._holeCard.value === 10) ||
        (this.hand.cards[0].value === 10 && this._holeCard.value === 1))
    ) {
      this._blackjack = true;
    }
    return this._blackjack;
  }

  get blackjack(): boolean {
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

  get bet(): number {
    return this._bet;
  }

  resetHand() {
    this.hand.resetHand();
    this.bet = 0;
    this._blackjack = false;
  }

  checkBlackjack(): boolean {
    if (this.hand.cards.length === 2 && this.hand.getSum().softTotal == 21) this._blackjack = true;
    return this._blackjack;
  }

  get blackjack(): boolean {
    return this._blackjack;
  }

  removeEnd() {
    if (this.hand.cards.length) {
      return this.hand.cards.pop()!;
    }
    return {} as Card;
  }
}

const sample = () => {
  if (state.shoe.length) {
    return state.shoe.pop()!;
  }
  return {} as Card;
};

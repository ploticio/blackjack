import ace_of_clubs from "../assets/cards/ace_of_clubs.svg";
import two_of_clubs from "../assets/cards/two_of_clubs.svg";
import three_of_clubs from "../assets/cards/three_of_clubs.svg";
import four_of_clubs from "../assets/cards/four_of_clubs.svg";
import five_of_clubs from "../assets/cards/five_of_clubs.svg";
import six_of_clubs from "../assets/cards/six_of_clubs.svg";
import seven_of_clubs from "../assets/cards/seven_of_clubs.svg";
import eight_of_clubs from "../assets/cards/eight_of_clubs.svg";
import nine_of_clubs from "../assets/cards/nine_of_clubs.svg";
import ten_of_clubs from "../assets/cards/ten_of_clubs.svg";
import jack_of_clubs from "../assets/cards/jack_of_clubs.svg";
import queen_of_clubs from "../assets/cards/queen_of_clubs.svg";
import king_of_clubs from "../assets/cards/king_of_clubs.svg";

import ace_of_diamonds from "../assets/cards/ace_of_diamonds.svg";
import two_of_diamonds from "../assets/cards/two_of_diamonds.svg";
import three_of_diamonds from "../assets/cards/three_of_diamonds.svg";
import four_of_diamonds from "../assets/cards/four_of_diamonds.svg";
import five_of_diamonds from "../assets/cards/five_of_diamonds.svg";
import six_of_diamonds from "../assets/cards/six_of_diamonds.svg";
import seven_of_diamonds from "../assets/cards/seven_of_diamonds.svg";
import eight_of_diamonds from "../assets/cards/eight_of_diamonds.svg";
import nine_of_diamonds from "../assets/cards/nine_of_diamonds.svg";
import ten_of_diamonds from "../assets/cards/ten_of_diamonds.svg";
import jack_of_diamonds from "../assets/cards/jack_of_diamonds.svg";
import queen_of_diamonds from "../assets/cards/queen_of_diamonds.svg";
import king_of_diamonds from "../assets/cards/king_of_diamonds.svg";

import ace_of_hearts from "../assets/cards/ace_of_hearts.svg";
import two_of_hearts from "../assets/cards/two_of_hearts.svg";
import three_of_hearts from "../assets/cards/three_of_hearts.svg";
import four_of_hearts from "../assets/cards/four_of_hearts.svg";
import five_of_hearts from "../assets/cards/five_of_hearts.svg";
import six_of_hearts from "../assets/cards/six_of_hearts.svg";
import seven_of_hearts from "../assets/cards/seven_of_hearts.svg";
import eight_of_hearts from "../assets/cards/eight_of_hearts.svg";
import nine_of_hearts from "../assets/cards/nine_of_hearts.svg";
import ten_of_hearts from "../assets/cards/ten_of_hearts.svg";
import jack_of_hearts from "../assets/cards/jack_of_hearts.svg";
import queen_of_hearts from "../assets/cards/queen_of_hearts.svg";
import king_of_hearts from "../assets/cards/king_of_hearts.svg";

import ace_of_spades from "../assets/cards/ace_of_spades.svg";
import two_of_spades from "../assets/cards/two_of_spades.svg";
import three_of_spades from "../assets/cards/three_of_spades.svg";
import four_of_spades from "../assets/cards/four_of_spades.svg";
import five_of_spades from "../assets/cards/five_of_spades.svg";
import six_of_spades from "../assets/cards/six_of_spades.svg";
import seven_of_spades from "../assets/cards/seven_of_spades.svg";
import eight_of_spades from "../assets/cards/eight_of_spades.svg";
import nine_of_spades from "../assets/cards/nine_of_spades.svg";
import ten_of_spades from "../assets/cards/ten_of_spades.svg";
import jack_of_spades from "../assets/cards/jack_of_spades.svg";
import queen_of_spades from "../assets/cards/queen_of_spades.svg";
import king_of_spades from "../assets/cards/king_of_spades.svg";

enum Suit {
  Club,
  Spade,
  Heart,
  Diamond,
}

export interface Card {
  value: number;
  suit: Suit;
  image: string;
}

export const deck: Card[] = [
  { value: 1, suit: Suit.Club, image: ace_of_clubs },
  { value: 2, suit: Suit.Club, image: two_of_clubs },
  { value: 3, suit: Suit.Club, image: three_of_clubs },
  { value: 4, suit: Suit.Club, image: four_of_clubs },
  { value: 5, suit: Suit.Club, image: five_of_clubs },
  { value: 6, suit: Suit.Club, image: six_of_clubs },
  { value: 7, suit: Suit.Club, image: seven_of_clubs },
  { value: 8, suit: Suit.Club, image: eight_of_clubs },
  { value: 9, suit: Suit.Club, image: nine_of_clubs },
  { value: 10, suit: Suit.Club, image: ten_of_clubs },
  { value: 10, suit: Suit.Club, image: jack_of_clubs },
  { value: 10, suit: Suit.Club, image: queen_of_clubs },
  { value: 10, suit: Suit.Club, image: king_of_clubs },
];

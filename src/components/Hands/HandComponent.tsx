import "../../styles/HandComponent.css";
import CardComponent from "../CardComponent";
import { Card } from "../../utilities/cards";

interface IProps {
  cards: Card[];
}
// TODO: replace key for map method
export default function HandComponent({ cards }: IProps) {
  return (
    <>
      <div className="hand">
        {cards.length > 0 && cards.map((card, index) => <CardComponent key={index} card={card} />)}
      </div>
      <h2>Hand: {cards.reduce((acc, card) => acc + card.value, 0)}</h2>
    </>
  );
}

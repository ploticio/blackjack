import "../../styles/HandComponent.css";
import CardComponent from "../CardComponent";
import { Card } from "../../utilities/cards";

interface IProps {
  cards: Card[];
}

export default function HandComponent({ cards }: IProps) {
  return (
    <>
      <div className="hand">{cards.length > 0 && cards.map((card) => <CardComponent card={card} />)}</div>
      <h2>Hand: {cards.reduce((acc, card) => acc + card.value, 0)}</h2>
    </>
  );
}

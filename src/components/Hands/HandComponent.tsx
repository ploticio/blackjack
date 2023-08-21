import "../../styles/HandComponent.css";
import CardComponent from "../Game/CardComponent";
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
    </>
  );
}

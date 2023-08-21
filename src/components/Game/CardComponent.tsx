import "../../styles/CardComponent.css";
import { Card } from "../../utilities/cards";

interface IProps {
  card: Card;
}

export default function CardComponent({ card }: IProps) {
  return (
    <>
      <div className="card">
        <img src={card.image} />
        {/* <h2>{card.value !== 0 ? card.value : "?"}</h2> */}
      </div>
    </>
  );
}

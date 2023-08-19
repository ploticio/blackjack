import { Card, card_back } from "../utilities/cards";

interface IProps {
  card: Card;
}

export default function CardComponent({ card }: IProps) {
  return (
    <>
      <div>
        <img src={card.image} />
        <h2>{card.image !== card_back ? card.value : "?"}</h2>
      </div>
    </>
  );
}

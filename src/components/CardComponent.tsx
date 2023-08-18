import { Card } from "../utilities/cards";

interface IProps {
  card: Card;
}

export default function CardComponent({ card }: IProps) {
  return (
    <>
      <div>
        <img src={card.image} />
        <h2>{card.value}</h2>
      </div>
    </>
  );
}

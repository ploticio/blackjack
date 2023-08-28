import "../../styles/HandComponent.css";
import CardComponent from "../Game/CardComponent";
import HandSum from "./HandSum";
import { Card } from "../../utilities/cards";
import { Status } from "../../utilities/hands";

interface IProps {
  cards: readonly Card[];
  status?: Status;
  showStatus?: boolean;
}

export default function HandComponent({ cards, status, showStatus = true }: IProps) {
  const getSum = () => {
    const hardTotal = cards.reduce((acc, card) => acc + card.value, 0);
    let softTotal = hardTotal;
    if (cards.some((card) => card.value === 1)) {
      softTotal = hardTotal + 10;
    }
    return {
      hardTotal,
      softTotal,
    };
  };

  return (
    <div>
      {showStatus &&
        (status === "Win!" ||
          status === "Bust!" ||
          status === "Loss!" ||
          status === "Push!" ||
          status === "Standing" ||
          status === "Playing") && <h1>{status}</h1>}
      <div className="hand">
        {cards.length > 0 && cards.map((card, index) => <CardComponent key={index} card={card} />)}
      </div>
      <HandSum sum={getSum()} status={status} />
    </div>
  );
}

import "../../styles/HandComponent.css";
import HandSum from "./HandSum";
import { Card } from "../../utilities/cards";
import { Status } from "../../utilities/hands";
import { AnimationScope, motion } from "framer-motion";

interface IProps {
  cards: readonly Card[];
  sum: { hardTotal: number; softTotal: number };
  scope: AnimationScope;
  status?: Status;
  isDealer?: boolean;
}

export default function HandComponent({ cards, status, isDealer = false, sum, scope }: IProps) {
  return (
    <div>
      <motion.div layout="position" ref={scope} className="hand">
        {cards.length > 0 && cards.map((card, index) => <img key={index} src={card.image} />)}
      </motion.div>
      <HandSum sum={sum} status={status} isDealer={isDealer} />
    </div>
  );
}

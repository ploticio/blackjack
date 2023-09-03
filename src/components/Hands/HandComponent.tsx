import "../../styles/HandComponent.css";
import HandSum from "./HandSum";
import { Card } from "../../utilities/cards";
import { Status } from "../../utilities/hands";
import { AnimationScope, motion } from "framer-motion";
import { useEffect } from "react";

interface IProps {
  cards: readonly Card[];
  sum: { hardTotal: number; softTotal: number };
  scope?: AnimationScope;
  renderPlayerCardsAnimation?: () => Promise<void>;
  renderDealerCardsAnimation?: () => Promise<void>;
  status?: Status;
  showStatus?: boolean;
}

export default function HandComponent({
  cards,
  status,
  showStatus = true,
  sum,
  scope,
  renderPlayerCardsAnimation,
  renderDealerCardsAnimation,
}: IProps) {
  useEffect(() => {
    if (renderPlayerCardsAnimation) renderPlayerCardsAnimation();
    else if (renderDealerCardsAnimation) renderDealerCardsAnimation();
  }, []);

  return (
    <div>
      {showStatus && (status === "Win!" || status === "Bust!" || status === "Loss!" || status === "Push!") && (
        <h1>{status}</h1>
      )}
      <motion.div layout="position" ref={scope} className="hand">
        {cards.length > 0 && cards.map((card, index) => <img key={index} src={card.image} />)}
      </motion.div>
      <HandSum sum={sum} status={status} showStatus={showStatus} />
    </div>
  );
}

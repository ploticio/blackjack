import "../../styles/HandComponent.css";
import CardComponent from "../Game/CardComponent";
import HandSum from "./HandSum";
import { Card } from "../../utilities/cards";
import { Status } from "../../utilities/hands";
import { Variants, motion } from "framer-motion";
import { AppSettings } from "../AppSettings";

interface IProps {
  cards: readonly Card[];
  status?: Status;
  showStatus?: boolean;
}

const containerVariant: Variants = {
  visible: { transition: { staggerChildren: AppSettings.ADD_CARD_SPEED } },
};

const cardAnimation: Variants = {
  hidden: { x: "-100vw", y: "-10vh" },
  visible: { x: 0, y: 0, transition: { type: "tween", duration: AppSettings.ADD_CARD_SPEED } },
  leave: { x: "-100vw", y: "-10vh", transition: { type: "tween", duration: 0.2 } },
};

const statusAnimation: Variants = {
  hidden: { y: "10vh", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "tween", delay: 0.5 } },
  leave: { y: "10vh", opacity: 0 },
};

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
    <div className="hand-data">
      {showStatus &&
        (status === "Win!" || status === "Bust!" || status === "Loss!" || status === "Push!" ? (
          <motion.h1 variants={statusAnimation} initial="hidden" animate="visible">
            {status}
          </motion.h1>
        ) : (
          <h1>‎</h1>
        ))}
      <motion.div
        layout="position"
        className="hand"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        exit="leave"
      >
        {cards.length > 0 &&
          cards.map((card, index) => (
            <motion.div key={index} variants={cardAnimation}>
              <CardComponent key={index} card={card} />
            </motion.div>
          ))}
      </motion.div>
      <HandSum sum={getSum()} status={status} />
    </div>
  );
}

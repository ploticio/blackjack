import "../../styles/HandComponent.css";
import { useEffect, useState } from "react";
import { Status } from "../../utilities/hands";
import { AnimationSettings } from "../../hooks/AnimationSettings";
import { useAnimate } from "framer-motion";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
  status?: Status;
  showStatus: boolean;
}

export default function HandSum({ sum, status, showStatus }: IProps) {
  const [delayedNum, setDelayedNum] = useState(sum);
  const [scope, animate] = useAnimate();
  const ifOutcome =
    status === Status.Win ||
    status === Status.Push ||
    status === Status.Loss ||
    status === Status.Bust ||
    status === Status.Standing;

  useEffect(() => {
    setTimeout(() => {
      setDelayedNum(sum);
    }, AnimationSettings.CARD_DRAW_SPEED * 1000);
  }, [sum]);

  const enterAnimation = async () => {
    animate(scope.current, { scale: 100 }, { duration: 0.3, delay: AnimationSettings.CARD_DRAW_SPEED * 4 });
  };

  useEffect(() => {
    enterAnimation();
  }, []);

  let result = "---";

  if (!showStatus) {
    result = delayedNum.softTotal <= 21 ? `Hand: ${delayedNum.softTotal}` : `Hand: ${delayedNum.hardTotal}`;
  } else {
    if (delayedNum.hardTotal !== delayedNum.softTotal && delayedNum.softTotal <= 21) {
      result = ifOutcome ? `Hand: ${delayedNum.softTotal}` : `Hand: ${delayedNum.hardTotal} (${delayedNum.softTotal})`;
    } else {
      result = `Hand: ${delayedNum.hardTotal}`;
    }
  }

  return (
    <h2 ref={scope} className="hand-sum">
      {result}
    </h2>
  );
}

import "../../styles/global.css";
import { useEffect, useState } from "react";
import { Status } from "../../utilities/hands";
import { AppSettings } from "../../utilities/AppSettings";
import { useAnimate } from "framer-motion";
import { useSnapshot } from "valtio";
import { state } from "../../store/store";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
  isDealer: boolean;
  status?: Status;
}

export default function HandSum({ sum, status, isDealer }: IProps) {
  const snapshot = useSnapshot(state);
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
    }, AppSettings.CARD_DRAW_SPEED * 1000);
  }, [sum]);

  const enterAnimation = async () => {
    animate(
      scope.current,
      { scale: 100 },
      { duration: AppSettings.SUM_LABEL_SPEED, delay: AppSettings.CARD_DRAW_SPEED * 4 }
    );
  };

  const exitAnimation = async () => {
    animate(scope.current, { scale: 0.01 }, { duration: AppSettings.SUM_LABEL_SPEED });
  };

  useEffect(() => {
    enterAnimation();
  }, []);

  useEffect(() => {
    if (status === Status.Win || status === Status.Push || status === Status.Loss || status === Status.Bust) {
      setTimeout(() => {
        exitAnimation();
      }, (AppSettings.OVERLAY_DELAY + AppSettings.OVERLAY_DURATION + AppSettings.OVERLAY_SPEED * 2 + AppSettings.CARD_EXIT_SPEED) * 1000);
    }
  }, [status]);

  let result = "---";

  if (isDealer) {
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
      {snapshot.showSums && result}
    </h2>
  );
}

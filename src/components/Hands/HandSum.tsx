import { useEffect, useState } from "react";
import { Status } from "../../utilities/hands";
import { AnimationSettings } from "../../hooks/AnimationSettings";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
  status?: Status;
  showStatus: boolean;
}

export default function HandSum({ sum, status, showStatus }: IProps) {
  const ifOutcome =
    status === Status.Win ||
    status === Status.Push ||
    status === Status.Loss ||
    status === Status.Bust ||
    status === Status.Standing;
  const [delayedNum, setDelayedNum] = useState(sum);

  useEffect(() => {
    setTimeout(() => {
      setDelayedNum(sum);
    }, AnimationSettings.CARD_DRAW_SPEED * 1000);
  });

  if (!showStatus) {
    return delayedNum.softTotal <= 21 ? <h2>Hand: {delayedNum.softTotal}</h2> : <h2> Hand: {delayedNum.hardTotal}</h2>;
  } else {
    if (delayedNum.hardTotal !== delayedNum.softTotal && delayedNum.softTotal <= 21) {
      return ifOutcome ? (
        <h2>Hand: {delayedNum.softTotal}</h2>
      ) : (
        <h2>
          Hand: {delayedNum.hardTotal} ({delayedNum.softTotal})
        </h2>
      );
    } else {
      return <h2>Hand: {delayedNum.hardTotal}</h2>;
    }
  }
}

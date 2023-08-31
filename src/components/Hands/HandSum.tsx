import { useEffect, useState } from "react";
import { Status } from "../../utilities/hands";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
  status?: Status;
}

export default function HandSum({ sum, status }: IProps) {
  const ifOutcome =
    status === Status.Win ||
    status === Status.Push ||
    status === Status.Loss ||
    status === Status.Bust ||
    status === Status.Standing;
  const [delayedNum, setDelayedNum] = useState(sum);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedNum(sum);
    }, 500);
    return () => clearTimeout(timer);
  });

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

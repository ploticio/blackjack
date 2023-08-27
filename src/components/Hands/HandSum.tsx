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

  if (sum.hardTotal !== sum.softTotal && sum.softTotal <= 21) {
    return ifOutcome ? (
      <h2>Hand: {sum.softTotal}</h2>
    ) : (
      <h2>
        Hand: {sum.hardTotal} ({sum.softTotal})
      </h2>
    );
  } else {
    return <h2>Hand: {sum.hardTotal}</h2>;
  }
}

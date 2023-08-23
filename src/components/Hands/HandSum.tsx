import { Status, useStore } from "../../store/store";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
}

export default function HandSum({ sum }: IProps) {
  const status = useStore((state) => state.status);
  const ifOutcome = status === Status.Win || status === Status.Push || status === Status.Loss || status === Status.Bust;

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

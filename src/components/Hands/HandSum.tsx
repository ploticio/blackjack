import { useStore } from "../../store/store";

interface IProps {
  sum: { hardTotal: number; softTotal: number };
}

export default function HandSum({ sum }: IProps) {
  const playerStanding = useStore((state) => state.playerStanding);

  if (sum.hardTotal !== sum.softTotal && sum.softTotal <= 21) {
    return playerStanding ? (
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

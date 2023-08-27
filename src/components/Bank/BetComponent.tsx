import { useSnapshot } from "valtio";
import { state } from "../../store/store";

export default function BetComponent() {
  const snapshot = useSnapshot(state);
  return (
    <>
      <h1>Bet: {snapshot.bet}</h1>
    </>
  );
}

import { useSnapshot } from "valtio";
import { state } from "../../store/store";

export default function MoneyComponent() {
  const snapshot = useSnapshot(state);
  return (
    <>
      <h1>Bank: {snapshot.bank}</h1>
    </>
  );
}

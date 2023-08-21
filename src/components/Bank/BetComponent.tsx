import { useStore } from "../../store/store";

export default function BetComponent() {
  const bet = useStore((state) => state.bet);
  return (
    <>
      <h1>Bet: {bet}</h1>
    </>
  );
}

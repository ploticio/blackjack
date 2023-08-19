import { useStore } from "../../store/store";
import HandComponent from "./HandComponent";

export default function DealerHand() {
  const dealerHand = useStore((state) => state.dealerHand);
  return (
    <>
      <h1>Dealer</h1>
      <HandComponent cards={dealerHand} />
    </>
  );
}

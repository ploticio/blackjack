import { useStore } from "../../store/store";
import HandComponent from "./HandComponent";
import HandSum from "./HandSum";

export default function DealerHand() {
  const dealerHand = useStore((state) => state.dealerHand);
  const dealerSum = useStore((state) => state.getDealerSum);
  return (
    <>
      <h1>Dealer</h1>
      <HandComponent cards={dealerHand} />
      <HandSum sum={dealerSum()} />
    </>
  );
}

import { useSnapshot } from "valtio";
import { state } from "../../store/store";
import { Heading } from "@radix-ui/themes";

export default function BetComponent() {
  const snapshot = useSnapshot(state);
  return (
    <>
      <Heading size="1">Bet: {snapshot.buffer}</Heading>
    </>
  );
}

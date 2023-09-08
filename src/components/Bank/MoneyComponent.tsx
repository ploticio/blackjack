import { useSnapshot } from "valtio";
import { state } from "../../store/store";
import { Heading } from "@radix-ui/themes";

export default function MoneyComponent() {
  const snapshot = useSnapshot(state);
  return (
    <>
      <Heading size="1">Bank: ${snapshot.bank.toFixed(2).replace(/\.00$/, "")}</Heading>
    </>
  );
}

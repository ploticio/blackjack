import { Flex } from "@radix-ui/themes";
import BetComponent from "./BetComponent";
import MoneyComponent from "./MoneyComponent";

export default function BankDisplay() {
  return (
    <Flex direction="column" gap="9">
      <MoneyComponent />
      <BetComponent />
    </Flex>
  );
}

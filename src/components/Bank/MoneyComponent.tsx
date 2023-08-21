import { useStore } from "../../store/store";

export default function MoneyComponent() {
  const bank = useStore((state) => state.bank);
  return (
    <>
      <h1>Bank: {bank}</h1>
    </>
  );
}

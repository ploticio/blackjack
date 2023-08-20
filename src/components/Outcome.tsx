import { useStore } from "../store/store";

export default function Outcome() {
  const status = useStore((state) => state.status);
  return (
    <>
      <div>
        <h1>{status}</h1>
      </div>
    </>
  );
}

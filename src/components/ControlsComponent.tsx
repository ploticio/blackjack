import { useStore } from "../store/store";

export default function ControlsComponent() {
  const sample = useStore((state) => state.sample);
  const addToPlayer = useStore((state) => state.addToPlayer);
  const resetHands = useStore((state) => state.resetHands);
  const addToDealer = useStore((state) => state.addToDealer);
  const flipCard = useStore((state) => state.flipCard);

  return (
    <>
      <button
        onClick={() => {
          addToPlayer(sample());
        }}
      >
        Hit
      </button>
      <button
        onClick={() => {
          flipCard();
        }}
      >
        Stand
      </button>
      <button onClick={() => resetHands()}>Reset Hands</button>
    </>
  );
}

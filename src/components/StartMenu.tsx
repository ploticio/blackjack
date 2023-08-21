import { useStore, Status } from "../store/store";

export default function StartMenu() {
  const setStatus = useStore((state) => state.setStatus);
  const shuffle = useStore((state) => state.shuffle);
  const sample = useStore((state) => state.sample);
  const addToDealer = useStore((state) => state.addToDealer);
  const addToPlayer = useStore((state) => state.addToPlayer);
  const addHoleCard = useStore((state) => state.addHoleCard);

  const handleGameStart = () => {
    setStatus(Status.Playing);

    for (let i = 0; i < 10; i++) {
      shuffle();
    }

    addToDealer(sample());
    addHoleCard();

    addToPlayer(sample());
    addToPlayer(sample());
  };

  return (
    <>
      <button
        onClick={() => {
          handleGameStart();
        }}
      >
        Play!
      </button>
    </>
  );
}

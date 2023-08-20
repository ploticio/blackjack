import { useStore, Status } from "../store/store";
import { card_back } from "../utilities/cards";

export default function StartMenu() {
  const setStatus = useStore((state) => state.setStatus);
  const shuffle = useStore((state) => state.shuffle);
  const sample = useStore((state) => state.sample);
  const addToDealer = useStore((state) => state.addToDealer);
  const addToPlayer = useStore((state) => state.addToPlayer);
  const setHoleImg = useStore((state) => state.setHoleImg);

  const handleGameStart = () => {
    setStatus(Status.Playing);

    for (let i = 0; i < 10; i++) {
      shuffle();
    }

    addToDealer(sample());
    const holeCard = { ...sample() };
    setHoleImg(holeCard.image);
    holeCard.image = card_back;
    addToDealer(holeCard);

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

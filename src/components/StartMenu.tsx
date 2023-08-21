import { useStore, Status } from "../store/store";

export default function StartMenu() {
  const setStatus = useStore((state) => state.setStatus);
  const shuffle = useStore((state) => state.shuffle);

  const handleGameStart = () => {
    for (let i = 0; i < 10; i++) {
      shuffle();
    }
    setStatus(Status.Betting);
  };

  return (
    <>
      <button onClick={() => handleGameStart()}>Play!</button>
    </>
  );
}

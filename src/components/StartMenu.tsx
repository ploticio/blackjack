import { useStore, Status } from "../store/store";

export default function StartMenu() {
  const setStatus = useStore((state) => state.setStatus);

  const handleGameStart = () => {
    setStatus(Status.Betting);
  };

  return (
    <>
      <button onClick={() => handleGameStart()}>Play!</button>
    </>
  );
}

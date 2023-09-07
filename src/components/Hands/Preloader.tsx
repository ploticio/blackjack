import { deck } from "../../utilities/cards";

export default function Preloader() {
  return (
    <div style={{ display: "none" }}>
      {deck.map((card, index) => (
        <img key={index} src={card.image} />
      ))}
    </div>
  );
}

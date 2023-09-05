import { AnimationScope } from "framer-motion";
import "../../styles/ResultOverlay.css";

interface Props {
  scope: AnimationScope;
  result: string;
}

export default function ResultOverlay({ scope, result }: Props) {
  return (
    <div ref={scope} className="overlay">
      <h1>{result}</h1>
    </div>
  );
}

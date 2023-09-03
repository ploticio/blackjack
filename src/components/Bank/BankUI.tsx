import BankControls from "./BankControls";
import BankDisplay from "./BankDisplay";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";
import "../../styles/BankUI.css";

export default function BankUI() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    enterAnimation2();
  });

  const enterAnimation2 = async () => {
    animate("h1", { scale: 10 });
    animate("button", { scale: 10 });
  };

  const exitAnimation = async () => {
    animate("h1", { scale: 0.1 });
    await animate("button", { scale: 0.1 });
  };

  return (
    <div ref={scope} className="bank-ui">
      <BankDisplay />
      <BankControls exitAnimation={exitAnimation} />
    </div>
  );
}

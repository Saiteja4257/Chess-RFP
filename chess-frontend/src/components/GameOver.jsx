import React, { useEffect, useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./GameOver.css";

// const Confetti = lazy(() => import("react-confetti"));

const GameOver = () => {
  const [searchParams] = useSearchParams();
  const winner = searchParams.get("winner");
  const navigate = useNavigate(); 
  const [setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWindowSize]);

  return (
    <div className={`game-over-container ${winner ? "winner-bg" : "loser-bg"}`}>
      {/* <Suspense fallback={<div>Loading...</div>}>
        {winner && (
          <Confetti width={windowSize.width} height={windowSize.height} />
        )}
      </Suspense> */}
      <div className="game-over-card">
        <h1 className="game-over-title">Game Over</h1>
        <h2
          className={`game-over-result ${
            winner ? "winner-text" : "loser-text"
          }`}
        >
          {winner ? `${winner} Wins! 🎉` : "It's a Draw! 🤝"}
        </h2>
        <button className="game-over-button" onClick={() => navigate("/dashboard")}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default GameOver;

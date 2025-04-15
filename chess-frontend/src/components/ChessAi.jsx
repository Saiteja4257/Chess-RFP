import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "../styles/ChessAi.css";
import Sidebar from "../pages/Sidebar";

const ChessAI = () => {
  const navigate = useNavigate();
  const game = useRef(new Chess());
  const [position, setPosition] = useState("start");
  const [status, setStatus] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStopped, setGameStopped] = useState(false);
  const aiDepth = 2;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const evaluateBoard = (board) => {
    let total = 0;
    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          const values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
          const value = values[piece.type] || 0;
          total += piece.color === "w" ? value : -value;
        }
      }
    }
    return total;
  };

  const minimax = (gameInstance, depth, alpha, beta, isMaximizing) => {
    if (depth === 0 || gameInstance.isGameOver()) {
      return -evaluateBoard(gameInstance.board());
    }

    const moves = gameInstance.moves();
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of moves) {
        gameInstance.move(move);
        const evalScore = minimax(gameInstance, depth - 1, alpha, beta, false);
        gameInstance.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of moves) {
        gameInstance.move(move);
        const evalScore = minimax(gameInstance, depth - 1, alpha, beta, true);
        gameInstance.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const getBestMove = (gameInstance, depth) => {
    let bestMove = null;
    let bestValue = -Infinity;

    for (let move of gameInstance.moves()) {
      gameInstance.move(move);
      const value = minimax(gameInstance, depth - 1, -Infinity, Infinity, false);
      gameInstance.undo();
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const updateStatus = useCallback(() => {
    const moveColor = game.current.turn() === "b" ? "Black" : "White";

    if (game.current.isCheckmate()) {
      const winner = moveColor === "White" ? "Black" : "White";
      setStatus(`Game over, ${moveColor} is in checkmate.`);
      navigate(`/game-over?winner=${winner}`);
    } else if (game.current.isDraw()) {
      setStatus("Game over, drawn position.");
      navigate(`/game-over`);
    } else {
      let newStatus = `${moveColor} to move`;
      if (game.current.isCheck()) {
        newStatus += `, ${moveColor} is in check`;
      }
      setStatus(newStatus);
    }
  }, [navigate]);

  const makeAIMove = () => {
    const bestMove = getBestMove(game.current, aiDepth);
    if (bestMove) {
      game.current.move(bestMove);
      setPosition(game.current.fen());
      updateStatus();
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameStarted || gameStopped) return false;

    const moves = game.current.moves({ verbose: true });
    const move = moves.find(
      (m) => m.from === sourceSquare && m.to === targetSquare
    );

    if (!move) return false;

    const moveObj = {
      from: sourceSquare,
      to: targetSquare,
      ...(move.promotion ? { promotion: "q" } : {}),
    };

    const result = game.current.move(moveObj);
    if (result === null) return false;

    setPosition(game.current.fen());
    updateStatus();

    setTimeout(() => {
      if (!gameStopped) makeAIMove();
    }, 300);

    return true;
  };

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  return (
    <div className="chessboard-container">
      <Sidebar />
      <div className="chessboard-wrapper">
        <Chessboard
          position={position}
          onPieceDrop={onDrop}
          boardWidth={500}
          customBoardStyle={{
            borderRadius: "1.5em",
            overflow: "hidden",
            boxShadow: `
              inset 0 -4px 0 rgba(0, 0, 0, 0.15),
              0 8px 20px rgba(7, 7, 7, 0.4)
            `,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#769656",
          }}
          customLightSquareStyle={{
            backgroundColor: "#eeeed2",
          }}
        />
      </div>
      <div className="aIright-section">
        <div className="status-text">{status}</div>
        <div className="button-group">
          {!gameStarted ? (
            <button
              onClick={() => {
                setGameStarted(true);
                setGameStopped(false);
              }}
            >
              Play
            </button>
          ) : (
            <button onClick={() => setGameStopped(!gameStopped)}>
              {gameStopped ? "Resume" : "Stop"}
            </button>
          )}
          <button
            onClick={() => {
              const newGame = new Chess();
              game.current = newGame;
              setPosition("start");
              setGameStarted(false);
              setGameStopped(false);
              updateStatus();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessAI;

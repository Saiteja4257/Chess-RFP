import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import io from "socket.io-client";
import "../styles/ChessGame.css";
import VideoChat from './VideoChat.js';
import Chat from "../pages/Chat.jsx";
import "../styles/chat.css";
import Sidebar from "../pages/Sidebar.jsx";

const socket = io("https://chess-rfp-41oy.onrender.com");

const ChessGame = () => {
    const [game, setGame] = useState(new Chess());
    const [room, setRoom] = useState("");
    const [playerColor, setPlayerColor] = useState(null);
    // const username = localStorage.getItem("username");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    useEffect(() => {
        socket.on("gameState", ({ fen, turn }) => {
            try {
                const newGame = new Chess();
                newGame.load(fen);
                setGame(newGame);
                console.log("Move received from server:", fen);

                if (playerColor && playerColor !== turn) {
                    console.log("Opponent's turn. You cannot move.");
                }
            } catch (error) {
                console.error("Error loading game state:", error);
            }
        });

        socket.on("assignColor", (color) => {
            setPlayerColor(color);
            console.log(`You are playing as: ${color}`);
        });

        socket.on("checkAlert", (message) => {
            alert(message);
        });

        socket.on("gameOver", ({ message, winner }) => {
            alert(message);
            window.location.href = `/game-over?winner=${winner}`;
        });

        return () => {
            socket.off("gameState");
            socket.off("assignColor");
            socket.off("checkAlert");
            socket.off("gameOver");
        };
    }, [playerColor]);

    const joinRoom = () => {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        if (room && userId && username) {
            socket.emit("joinGame", { room, userId, username });
        } else {
            alert("User not logged in or Room ID missing.");
        }
    };

    const onDrop = (sourceSquare, targetSquare) => {
        try {
            if (game.turn() !== playerColor) {
                console.log("Not your turn!");
                return "snapback";
            }

            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });

            if (!move) return "snapback";

            setGame(new Chess(game.fen()));
            socket.emit("makeMove", { room, move });

            if (game.isCheckmate()) {
                alert("Checkmate! Game over.");
            } else if (game.isStalemate()) {
                alert("Stalemate! Game drawn.");
            } else if (game.isDraw()) {
                alert("Draw! Game over.");
            } else if (game.isCheck()) {
                alert("Check! Your king is under attack.");
            }

        } catch (error) {
            console.error("Invalid move:", error);
            return "snapback";
        }
    };

    return (
        <div className="chessboard-container hide-scrollbar">
            <Sidebar />

            <div className="main-game-section">
                {/* Chessboard */}
                <div className="chessboard-wrapper">
                    <Chessboard
                        position={game.fen()}
                        onPieceDrop={onDrop}
                        boardOrientation={playerColor === "b" ? "black" : "white"}
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
                        
                {/* Room Controls + Video + Chat */}
                <div className="right-section">
                    <div className="room-controls">
                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                        <button onClick={joinRoom}>Join Game</button>
                        <br></br>
                        <p>You are playing as: {playerColor || "Waiting..."}</p>
                    </div>
                    
                    <div className="video-chat-container">
                        <VideoChat />
                    </div>
                    
                    <div className="chat-container">
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessGame;

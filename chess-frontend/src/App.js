import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import ChessGame from "./components/ChessGame.js";
// import VideoChat from "./components/VideoChat"; // ❌ Removed unused VideoChat
import GameOver from "./components/GameOver.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Chat2 from "./pages/Chat2.jsx";
import Profile from "./pages/Profile.jsx";
import ChessAi from "./components/ChessAi.jsx";
// import ProfileAvatar from "./pages/ProfileAvatar.jsx";
import ChessGuidelines from "./pages/Guidelines/ChessGuideLines";

import ChessBoardSetup from "./pages/Guidelines/chs";
import BasicRules from "./pages/Guidelines/bs";
import TipsForPlaying from "./pages/Guidelines/ch1";
import Tactics from "./pages/Guidelines/Tac";
import CheckAndCheckmate from "./pages/Guidelines/cc";
import EndgameConcepts from "./pages/Guidelines/end";
import CommonMistakes from "./pages/Guidelines/comm";
import OpeningStrategies from "./pages/Guidelines/op";
import AdvancedStrategies from "./pages/Guidelines/adv";
import DefensiveTechniques from "./pages/Guidelines/def";
import FamousGames from "./pages/Guidelines/his";
import PsychologyOfChess from "./pages/Guidelines/mind";
import PlayingAgainstAI from "./pages/Guidelines/ai";
import TournamentRules from "./pages/Guidelines/rules";
import Game from "./pages/game.jsx";
import "./App.css";
function App() {
    return (
        <Router>
            <div className="App">

            {/* <div style={{ position: "absolute", top: 10, right: 10 }}>
            <ProfileAvatar />
            </div> */}

                <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<HomePage />} /> {/* ✅ Changed from MainGame to HomePage */}

                    {/* Main Game */}
                    <Route path="/maingame" element={<MainGame />} /> {/* ✅ New route */}

                    {/* Game Over Page */}
                    <Route path="/game-over" element={<GameOver />} />

                    {/* Auth Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/Chat2" element={<Chat2 />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/chessAi" element={<ChessAi />} />
                    <Route path="/profile" 
                    element={<Profile/>}/>
                    
          {/* Chess Guidelines Main Page */}
          <Route path="/ChessGuideLines" element={<ChessGuidelines />} />

{/* Chess Subpages */}
<Route path="/chs" element={<ChessBoardSetup />} />
<Route path="/bs" element={<BasicRules />} />
<Route path="/ch1" element={<TipsForPlaying />} />
<Route path="/tac" element={<Tactics />} />
<Route path="/cc" element={<CheckAndCheckmate />} />
<Route path="/end" element={<EndgameConcepts />} />
<Route path="/comm" element={<CommonMistakes />} />
<Route path="/op" element={<OpeningStrategies />} />
<Route path="/adv" element={<AdvancedStrategies />} />
<Route path="/def" element={<DefensiveTechniques />} />
<Route path="/his" element={<FamousGames />} />
<Route path="/mind" element={<PsychologyOfChess />} />
<Route path="/ai" element={<PlayingAgainstAI />} />
<Route path="/rules" element={<TournamentRules />} />
                </Routes>
            </div>
        </Router>
    );
}

// ✅ Updated MainGame component
const MainGame = () => {
    const [room] = useState(""); // ❌ Removed setRoom since input is gone

    return (
        <>
            <ChessGame room={room} />
            {/* ❌ Removed <VideoChat /> */}
        </>
    );
};

// ✅ New HomePage component
const HomePage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/register");
    };
    return (
        <div className="landing-page">
        <div className="landing-content">
            <div className="text-content"> 
          <h1>Welcome to BattleBoard♟️</h1>
          <p>
          "Think Ahead. Play Smart. Rule the Board."
          </p>
          <button className="start-button" onClick={handleStart}>Let's Go</button>
          </div>
          <img className="ck" src="/chessKingdom2.png" alt=""></img>
        </div>
      </div>
    );
};

export default App;

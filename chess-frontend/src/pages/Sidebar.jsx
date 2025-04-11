import React from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="/dashboard" className="menu-item" title="Home">
        <span role="img" aria-label="home">🏠</span>
        <span>Home</span>
      </a>
      <a href="/game" className="menu-item" title="Play Chess">
        <span role="img" aria-label="chess">♟️</span>
        <span>Game</span>
      </a>
      <a href="/profile" className="menu-item" title="Profile">
        <span role="img" aria-label="profile">👤</span>
        <span>Profile</span>
      </a>
      <div className="menu-item submenu-trigger">
  <span>📕</span>
  <span>Guidelines</span>

  {/* Submenu */}
  <div className="submenu">
  <a href="/chs">📋 Chessboard Setup</a>
<a href="/bs">📘 Basic Rules</a>
<a href="/ch1">✅ Tips for Playing</a>
<a href="/tac">♟️ Tactics</a>
<a href="/cc">♛ Check & Checkmate</a>
<a href="/end">🔚 Endgame Concepts</a>
<a href="/comm">⚠️ Common Mistakes</a>
<a href="/op">🧠 Opening Strategies</a>
<a href="/adv">🚀 Advanced Strategies</a>
<a href="/def">🛡️ Defensive Techniques</a>
<a href="/his">🏆 Famous Games</a>
<a href="/mind">🧠 Psychology of Chess</a>
<a href="/ai">🤖 Playing Against AI</a>
<a href="/rules">📜 Tournament Rules</a>

  </div>
</div>
    </div>
  );
};

export default Sidebar;

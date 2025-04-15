import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Guidelines/Dashboard.css"
const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.body.classList.add("dashboard-page");
    
        return () => {
          document.body.classList.remove("dashboard-page");
        };
      }, []);
    return (
      
        <div className="dashboard-container">

          <img className="chessimage" src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png" alt=""></img>
        <div className="dashboard-card">
          <h2 className="dashboard-welcome">Welcome Back! 🎉</h2>
          <p className="dashboard-message">
            Ready to jump into the action? Choose what you’d like to do next.
          </p>
          <div className="dashboard-buttons">
            <button className="dashboard-button left" onClick={() => navigate("/game")}>
              🎮 Play
            </button>
            <button
              className="dashboard-button right"
              onClick={() => navigate("/Chat2")}
            >
              💬 Go to Chat
            </button>
            <button
              className="dashboard-button left"
              onClick={() => navigate("/ChessGuideLines")}
            >
              📕 GuideLines
            </button>
            <button
              className="dashboard-button left"
              onClick={() => navigate("/profile")}
            >
              🕵️‍♂️ Profile
            </button>
          </div>
        </div>
      </div>
    );
};

export default Dashboard;

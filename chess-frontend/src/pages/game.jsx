import React from 'react';
import { useNavigate} from "react-router-dom";
import '../styles/game.css';
const ChooseGameMode = () => {
    const navigate = useNavigate();
  return (

    <div className="choose-container">
      <h1 className="choose-title">♟️Choose Game Mode♟️</h1>
      <div className="button-wrapper">
        <button className="game-button"onClick={() => navigate('/chessAi')} >
          <img src="https://static.vecteezy.com/system/resources/previews/019/814/601/non_2x/robot-vs-human-playing-chess-game-artificial-intelligence-technology-symbol-cartoon-illustration-vector.jpg" alt="Play vs AI" />
          <br></br>
          <h2 className="option">Play Vs AI</h2>
        </button>
        
        <button className="game-button" onClick={() => navigate('/maingame')}>
          <img src="https://media.istockphoto.com/id/1222517294/vector/draw.jpg?s=612x612&w=0&k=20&c=oQW3Bf2COveSBKKCh0fn9N9RTp9ZaEXoEttl_SRoMDs=" alt="Play vs Friend" />
          <br></br>
          <h2 className='option' >Play with Friend</h2>
        </button>
      </div>
    </div>
  );
};

export default ChooseGameMode;
import React from 'react';
import './battlescreen.css';

const BattleScreen = () => {
  return (
    <div className="page-container">
    <div className="battle-screen">
      <div className="player-plant">
        <div className="plant-info" id="player-plant-info">
          <span>Inch Plant</span>
          <span>Lvl 25</span>
          <div className="health-bar">
            <div className="health"></div>
          </div>
        </div>
        <div className="player-plant-battler">
        <img className="plant-image" src={`${process.env.PUBLIC_URL}/assets/inchplant.png`} alt="Inch Plant" />
        </div>
      </div>
      <div className="opponent-plant">
        <div className="plant-info" id="opponent-plant-info">
          <span>Spider Plant</span>
          <span>Lvl 28</span>
          <div className="health-bar">
            <div className="health"></div>
          </div>
        </div>
        <div className="opponent-plant-battler">
        <img className="plant-image" src={`${process.env.PUBLIC_URL}/assets/spiderplant.png`} alt="Spider Plant" />
        </div>
      </div>
     
    </div>
    <div className="attack-screen">
    <div className="actions">
        <button>Attack 1</button>
        <button>Attack 2</button>
        <button>Attack 3</button>
        <button>Attack 4</button>
      </div>
      <div className="status">
        <span>Status: </span>
        <span>Disarmed</span>
      </div>
    </div>
    </div>
  );
};

export default BattleScreen;

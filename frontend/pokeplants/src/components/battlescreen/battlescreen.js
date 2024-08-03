import React, { useEffect } from 'react';
import './battlescreen.css';

const BattleScreen = () => {
  useEffect(() => {
    document.body.classList.add('battle-bg');
    return () => {
      document.body.classList.remove('battle-bg');
    };
  }, []);

  return (
    <div className="page-container">
    <div className="battle-screen">
      <div className="player-plant">
        <div className="plant-info" id="player-plant-info">
          <div className="plant-name-lvl">
            <span>Inch Plant</span>
            <span>Lvl 25</span>
          </div>
          <div className="health-bar">
            <div className="health"></div>
          </div>
          <div class="hp-status">
            <span>HP</span> <span>78/122</span>
          </div>
        </div>
        <div className="player-plant-battler">
        <img className="plant-image" src={`${process.env.PUBLIC_URL}/assets/inchplant.png`} alt="Inch Plant" />
        </div>
      </div>
      <div className="opponent-plant">
        <div className="plant-info" id="opponent-plant-info">
          <div className="plant-name-lvl">
            <span>Spider Plant</span>
            <span>Lvl 28</span>
          </div>
          <div className="health-bar">
            <div className="health"></div>
          </div>
          <div class="hp-status">
            <span>HP</span> <span>78/122</span>
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
        <div className="status-effects">
          <span>Status: </span>
          <span>Poisoned</span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BattleScreen;

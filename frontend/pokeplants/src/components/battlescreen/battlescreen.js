import React, { useEffect, useState } from 'react';
import './battlescreen.css';

const BattleScreen = () => {
  useEffect(() => {
    document.body.classList.add('battle-bg');
    return () => {
      document.body.classList.remove('battle-bg');
    };
  }, []);

    const [player, setPlayer] = useState({
      name: 'Inch Plant',
      level: 25,
      maxHP: 122,
      currentHP: 122
    });
  
    const [opponent, setOpponent] = useState({
      name: 'Spider Plant',
      level: 28,
      maxHP: 122,
      currentHP: 122
    });
  
    const [attacking, setAttacking] = useState(false);
  
    const calculateHPClass = (hp, maxHP) => {
      const percentage = (hp / maxHP) * 100;
      if (percentage < 10) return 'hp-red';
      if (percentage < 50) return 'hp-yellow';
      return 'hp-green';
    };
  
    const handleAttack = () => {
      setAttacking(true);
      setOpponent(prev => {
        const newHP = Math.max(prev.currentHP - 25, 0);
        return { ...prev, currentHP: newHP };
      });
      setTimeout(() => setAttacking(false), 500); // Reset animation after 500ms
    };

  return (
    <div className="page-container">
    <div className="battle-screen">
      <div className="player-plant">
        <div className="plant-info" id="player-plant-info">
          <div className="plant-name-lvl">
          <span>{player.name}</span>
          <span>Lvl {player.level}</span>
          </div>
          <div className={`health-bar ${calculateHPClass(player.currentHP, player.maxHP)}`}>
              <div
                className="health"
                style={{ width: `${(player.currentHP / player.maxHP) * 100}%` }}
              ></div>
            </div>
            <div className="hp-status">
              <span>HP</span> <span>{player.currentHP}/{player.maxHP}</span>
            </div>
        </div>
        <div className="player-plant-battler">
        <img className={`plant-image ${player.currentHP === 0 ? 'fainted' : ''}`} src={`${process.env.PUBLIC_URL}/assets/inchplant.png`} alt="Inch Plant" />
        </div>
      </div>
      <div className="opponent-plant">
        <div className="plant-info" id="opponent-plant-info">
          <div className="plant-name-lvl">
          <span>{opponent.name}</span>
          <span>Lvl {opponent.level}</span>
          </div>
          <div className={`health-bar ${calculateHPClass(opponent.currentHP, opponent.maxHP)}`}>
              <div
                className="health"
                style={{ width: `${(opponent.currentHP / opponent.maxHP) * 100}%` }}
              ></div>
            </div>
            <div className="hp-status">
              <span>HP</span> <span>{opponent.currentHP}/{opponent.maxHP}</span>
            </div>
        </div>
        <div className={`opponent-plant-battler ${attacking ? 'attacking' : ''}`}>
            <img className={`plant-image ${opponent.currentHP === 0 ? 'fainted' : ''}`} src={`${process.env.PUBLIC_URL}/assets/spiderplant.png`} alt="Spider Plant" />
        </div>
      </div>
     
    </div>
    <div className="attack-screen">
      <div className="actions">
      <button onClick={handleAttack}>Attack 1</button>
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

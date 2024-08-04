import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './battlescreen.css';
import socket from '../../socket';

const BattleScreen = () => {
  const location = useLocation();
  const { playerId, selectedPlant } = location.state || {};
  const [player, setPlayer] = useState({
    name: selectedPlant?.name || 'Inch Plant',
    level: selectedPlant?.level || 25,
    maxHP: selectedPlant?.maxHP || 122,
    currentHP: selectedPlant?.currentHP || 122,
    ATK: 90,
    DEF: 30
  });

  const [opponent, setOpponent] = useState({
    name: 'Spider Plant',
    level: 28,
    maxHP: 122,
    currentHP: 122,
    ATK: 90,
    DEF: 30
  });

  const [status, setStatus] = useState({});
  const [attacking, setAttacking] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    document.body.classList.add('battle-bg');
    return () => {
      document.body.classList.remove('battle-bg');
    };
  }, []);

  useEffect(() => {
    /*socket().on('connect', () => {
      console.log('Connected to server');
      socket().emit('queue_battle');
    });*/

    socket().on('init_curr_stats', (data) => {
      setStatus(data);
      
      console.log(data)
    });

    socket().on('your_turn', (data) => {
      console.log(data.message);
      setIsYourTurn(true);
    });

    socket().on('move_result', (data) => {
      console.log(data);
      if (data.player === parseInt(playerId)) {
        setOpponent(prev => ({
          ...prev,
          currentHP: data.opponent_health
        }));
      } else {
        setPlayer(prev => ({
          ...prev,
          currentHP: data.opponent_health
        }));
      }
      setIsYourTurn(false);
    });

    socket().on('game_over', (data) => {
      console.log(`Game Over! Winner: ${data.winner}`);
      // Handle game over scenario (e.g., show a modal, redirect, etc.)
    });

    socket().on('error', (data) => {
      console.error('Error:', data.message);
    });

    return () => {
      socket().off('init_curr_stats');
      socket().off('your_turn');
      socket().off('move_result');
      socket().off('game_over');
      socket().off('error');
    };
  }, [playerId]);

  const handleAttack = (move) => {
    if (!isYourTurn) {
      console.log("It's not your turn!");
      return;
    }
    setAttacking(true);
    socket().emit('move', { player: parseInt(playerId), move });
    setTimeout(() => setAttacking(false), 500);
  };

  const calculateHPClass = (hp, maxHP) => {
    const percentage = (hp / maxHP) * 100;
    if (percentage < 10) return 'hp-red';
    if (percentage < 50) return 'hp-yellow';
    return 'hp-green';
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
          <button onClick={() => handleAttack('Attack 1')} disabled={!isYourTurn}>Solar Beam</button>
          <button onClick={() => handleAttack('Attack 2')} disabled={!isYourTurn}>Pollen Bomb</button>
          <button onClick={() => handleAttack('Attack 3')} disabled={!isYourTurn}>Vine Whip</button>
          <button onClick={() => handleAttack('Attack 4')} disabled={!isYourTurn}>Leaf Storm</button>
        </div>
        <div className="status">
          <div className="status-effects">
            <span>Status: </span>
            <span>{isYourTurn ? 'Your turn' : "Opponent's turn"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;
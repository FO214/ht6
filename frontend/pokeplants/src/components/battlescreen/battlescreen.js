import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './battlescreen.css';
import socket from "../../socket"

const BattleScreen = () => {
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

  useEffect(() => {
    document.body.classList.add('battle-bg');
    return () => {
      document.body.classList.remove('battle-bg');
    };
  }, []);

  useEffect(() => {

    socket.on('player_assignment', (data) => {
      console.log(`Assigned player: ${data.player}`);
    });

    socket.on('init_curr_stats', (data) => {
      console.log(`Initial stats:`, data);
    });

    socket.on('game_start', (data) => {
      console.log(data.message);
    });

    socket.on('your_turn', (data) => {
      console.log(data.message);
    });

    socket.on('move_result', (data) => {
      console.log(data);
      if (data.player === 1) {
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
    });

    socket.on('game_over', (data) => {
      console.log(`Game Over! Winner: ${data.winner}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('player_assignment');
      socket.off('init_curr_stats');
      socket.off('game_start');
      socket.off('your_turn');
      socket.off('move_result');
      socket.off('game_over');
      socket.off('disconnect');
    };
  }, []);

  const handleAttack = (move) => {
    setAttacking(true);
    socket.emit('move', { player: 1, move });
    setTimeout(() => setAttacking(false), 500); // Reset animation after 500ms
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
          <button onClick={() => handleAttack('Attack 1')}>Attack 1</button>
          <button onClick={() => handleAttack('Attack 2')}>Attack 2</button>
          <button onClick={() => handleAttack('Attack 3')}>Attack 3</button>
          <button onClick={() => handleAttack('Attack 4')}>Attack 4</button>
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

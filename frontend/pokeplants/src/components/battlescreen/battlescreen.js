import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './battlescreen.css';
import socket from '../../socket';
import Modal from '../end-popup/end-popup';

const BattleScreen = () => {
  const location = useLocation();
  const { playerId, selectedPlant } = location.state || {};
  const defaultPlayer = {
    name: selectedPlant?.name || 'Inch Plant',
    level: selectedPlant?.level || 25,
    maxHP: selectedPlant?.maxHP || 122,
    currentHP: selectedPlant?.currentHP || 122,
    ATK: 90,
    DEF: 30,
  };

  const defaultOpponent = {
    name: 'Spider Plant',
    level: 28,
    maxHP: 122,
    currentHP: 122,
    ATK: 90,
    DEF: 30,
  };

  const [player, setPlayer] = useState(playerId === '1' ? defaultPlayer : defaultOpponent);
  const [opponent, setOpponent] = useState(playerId === '1' ? defaultOpponent : defaultPlayer);
  const [status, setStatus] = useState({});
  const [attacking, setAttacking] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    document.body.classList.add('battle-bg');
    return () => {
      document.body.classList.remove('battle-bg');
    };
  }, []);

  useEffect(() => {
    const fetchStats = async (userId) => {
      try {
        const response = await fetch('http://100.67.6.78:9631/get-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: userId }),
        });
  
        const data = await response.json();
  
        console.log(`Fetched stats for user ${userId}:`, data);
  
        if (userId == 1) {
          if(playerId == 1) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              name: data.name || prevPlayer.name,
              level: data.level || prevPlayer.level,
              maxHP: data.maxHP || prevPlayer.maxHP,
              currentHP: data.currentHP || prevPlayer.currentHP,
              ATK: data.ATK || prevPlayer.ATK,
              DEF: data.DEF || prevPlayer.DEF,
            }));
          } else {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              name: data.name || prevOpponent.name,
              level: data.level || prevOpponent.level,
              maxHP: data.maxHP || prevOpponent.maxHP,
              currentHP: data.currentHP || prevOpponent.currentHP,
              ATK: data.ATK || prevOpponent.ATK,
              DEF: data.DEF || prevOpponent.DEF,
            }));
          }
        } else {
          if(playerId==1) {
            setOpponent((prevOpponent) => ({
              ...prevOpponent,
              name: data.name || prevOpponent.name,
              level: data.level || prevOpponent.level,
              maxHP: data.maxHP || prevOpponent.maxHP,
              currentHP: data.currentHP || prevOpponent.currentHP,
              ATK: data.ATK || prevOpponent.ATK,
              DEF: data.DEF || prevOpponent.DEF,
            }));
          } else {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              name: data.name || prevPlayer.name,
              level: data.level || prevPlayer.level,
              maxHP: data.maxHP || prevPlayer.maxHP,
              currentHP: data.currentHP || prevPlayer.currentHP,
              ATK: data.ATK || prevPlayer.ATK,
              DEF: data.DEF || prevPlayer.DEF,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
  
    fetchStats(1);
    fetchStats(2);
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
      setAnnouncement(`${data.player === 1 ? player.name : opponent.name } uses ${data.move}!`);
    });

    socket().on('game_over', (data) => {
      console.log(`Game Over! Winner: ${data.winner}`);
      setTimeout(() => {
        if (playerId == data.winner) {
          setIsModalOpen(true);
          setModalMessage('You Win!');
        } else {
          setIsModalOpen(true);
          setModalMessage('You Lose :(');
        }
      }, 5000);
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
    setTimeout(() => {
      setAttacking(false)
    }, 500);
  };

  const calculateHPClass = (hp, maxHP) => {
    const percentage = (hp / maxHP) * 100;
    if (percentage < 10) return 'hp-red';
    if (percentage < 50) return 'hp-yellow';
    return 'hp-green';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                style={{ width: `${(Math.max(0,player.currentHP) / player.maxHP) * 100}%` }}
              ></div>
            </div>
            <div className="hp-status">
              <span>HP</span> <span>{Math.max(0,player.currentHP)}/{player.maxHP}</span>
            </div>
          </div>
          <div className="player-plant-battler">
            <img className={`plant-image ${Math.max(0,player.currentHP) <= 0 ? 'fainted' : ''}`} src={player.name == "Inch Plant" ? `${process.env.PUBLIC_URL}/assets/inchplant.png` : `${process.env.PUBLIC_URL}/assets/spiderplant.png`} alt="" />
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
                style={{ width: `${(Math.max(0,opponent.currentHP) / opponent.maxHP) * 100}%` }}
              ></div>
            </div>
            <div className="hp-status">
              <span>HP</span> <span>{Math.max(0,opponent.currentHP)}/{opponent.maxHP}</span>
            </div>
          </div>
          <div className={`opponent-plant-battler ${attacking ? 'attacking' : ''}`}>
            <img className={`plant-image ${opponent.currentHP <= 0 ? 'fainted' : ''}`} src = {player.name == "Spider Plant" ? `${process.env.PUBLIC_URL}/assets/inchplant.png` : `${process.env.PUBLIC_URL}/assets/spiderplant.png`} alt="" />
          </div>
        </div>
      </div>
      <div className="attack-text">
        <h3>{announcement}</h3>
      </div>
      <div className="attack-screen">
        <div className="actions">
          <button onClick={() => handleAttack('Solar Beam')} disabled={!isYourTurn || player.currentHP <= 0 || opponent.currentHP <= 0}>Solar Beam</button>
          <button onClick={() => handleAttack('Pollen Bomb')} disabled={!isYourTurn || player.currentHP <= 0 || opponent.currentHP <= 0}>Pollen Bomb</button>
          <button onClick={() => handleAttack('Vine Whip')} disabled={!isYourTurn || player.currentHP <= 0 || opponent.currentHP <= 0}>Vine Whip</button>
          <button onClick={() => handleAttack('Leaf Storm')} disabled={!isYourTurn || player.currentHP <= 0 || opponent.currentHP <= 0}>Leaf Storm</button>
        </div>
        <div className="status">
          <div className="status-effects">
            <span>Status: </span>
            <span>{isYourTurn ? 'Your turn' : "Opponent's turn"}</span>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
      />
    </div>
  );
};

export default BattleScreen;
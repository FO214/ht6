import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthButton from './components/authbutton/authbutton';
import BattleScreen from './components/battlescreen/battlescreen';
import Plantdex from './components/plantdex/plantdex';
import Modal from './components/modal/modal';
import './App.css';
import socket from './socket';

const App = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [initialRedirect, setInitialRedirect] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [playerId, setPlayerId] = useState(-1);

  useEffect(() => {
    if (isAuthenticated && initialRedirect) {
      setInitialRedirect(false);
      navigate('/');
    }
  }, [isAuthenticated, initialRedirect, navigate]);

  useEffect(() => {
    // Simulate fetching plant data
    setPlants(['Plant 1', 'Plant 2', 'Plant 3']);
    socket().on('game_start', () => {
      console.log('owo');
      setIsModalOpen(false);
      console.log(playerId, selectedPlant);
      navigate('/battle', { state: { playerId, selectedPlant } }); // feed the playerId
    });

    socket().on('player_assignment', (data) => {
      console.log(`Assigned player: ${data.player}`);
      setPlayerId(data.player);
    });

    return () => {
      console.log('close');
      socket().off('game_start');
      socket().off('player_assignment');
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isLoadingScreen) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoadingScreen]);

  const handleStartBattle = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
      setElapsedTime(0);
    } else {
      loginWithRedirect({
        appState: { targetUrl: '/battle' }
      });
    }
  };

  const handleGoToPlantdex = () => {
    if (isAuthenticated) {
      navigate('/plantdex');
    } else {
      loginWithRedirect({
        appState: { targetUrl: '/plantdex' }
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsLoadingScreen(false);
    setElapsedTime(0);
  };

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setElapsedTime(0);
    setIsLoadingScreen(true);
    setIsModalOpen(true);
    socket().emit('queue_battle');
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AuthButton />
      <Routes>
        <Route path="/" element={<Home handleGoToPlantdex={handleGoToPlantdex} handleStartBattle={handleStartBattle} />} />
        <Route path="/battle" element={<BattleScreen selectedPlant={selectedPlant} />} />
        <Route path="/plantdex" element={<Plantdex />} />
      </Routes>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        plants={plants}
        onSelectPlant={handleSelectPlant}
        isLoadingScreen={isLoadingScreen}
        elapsedTime={elapsedTime}
      />
    </div>
  );
};

const Home = ({ handleGoToPlantdex, handleStartBattle }) => {
  return (
    <div>
      <h1 className="title">POKÉPLANTS</h1>
      <div className="starting-buttons">
        <button onClick={handleGoToPlantdex}>GO TO PLANTDEX</button>
        <button onClick={handleStartBattle}>START BATTLING</button>
      </div>
    </div>
  );
};

export default App;

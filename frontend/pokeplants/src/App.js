import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthButton from './components/authbutton/authbutton';
import BattleScreen from './components/battlescreen/battlescreen';
import Plantdex from './components/plantdex/plantdex';
import './App.css';

const App = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [initialRedirect, setInitialRedirect] = useState(true);

  useEffect(() => {
    if (isAuthenticated && initialRedirect) {
      setInitialRedirect(false);
      navigate('/');
    }
  }, [isAuthenticated, initialRedirect, navigate]);

  const handleStartBattle = () => {
    if (isAuthenticated) {
      navigate('/battle');
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AuthButton />
      <Routes>
        <Route path="/" element={<Home handleGoToPlantdex={handleGoToPlantdex} handleStartBattle={handleStartBattle} />} />
        <Route path="/battle" element={<BattleScreen />} />
        <Route path="/plantdex" element={<Plantdex />} />
      </Routes>
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

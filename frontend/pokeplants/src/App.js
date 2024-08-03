import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthButton from './components/authbutton/authbutton';
import BattleScreen from './components/battlescreen/battlescreen';
import Plantdex from './components/plantdex/plantdex';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [initialRedirect, setInitialRedirect] = useState(true);

  useEffect(() => {
    if (isAuthenticated && initialRedirect) {
      setInitialRedirect(false);
      navigate('/plantdex');
    }
  }, [isAuthenticated, initialRedirect, navigate]);

  const handleStartBattle = () => {
    if (isAuthenticated) {
      navigate('/battle');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AuthButton />
      <button onClick={handleStartBattle}>Start Battle</button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<BattleScreen />} />
        <Route path="/plantdex" element={<Plantdex />} />
      </Routes>
    </div>
  );
};

const Home = () => {
  return <h1>Home Screen</h1>;
};

export default App;

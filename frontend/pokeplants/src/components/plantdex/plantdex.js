import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './plantdex.css';

const plants = ['Plant 1', 'Plant 2', 'Plant 3'];

const Plantdex = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.classList.add('plant-bg');
    return () => {
      document.body.classList.remove('plant-bg');
    };
  }, []);

  const [selectedPlant, setSelectedPlant] = useState(plants[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [infoHighlighted, setInfoHighlighted] = useState(false);

  useEffect(() => {
    setSelectedPlant(plants[0]);
  }, []);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    setShowInfo(false);
    setInfoHighlighted(false);
  };

  const handleInfoClick = () => {
    if (showInfo) {
      setShowInfo(false);
      setInfoHighlighted(false);
    } else {
      setShowInfo(true);
      setInfoHighlighted(true);
    }
  };

  const handleBackClick = () => {
    setSelectedPlant(null);
    setShowInfo(false);
    setInfoHighlighted(false);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="plantdex-container">
      <button className="home-button" onClick={handleHomeClick}>HOME</button> {/* Updated button */}
      <h1>PLANTDEX</h1>
      <div className="content">
        <div className="sidebar">
          <div className="toggle-buttons">
            <button 
              onClick={handleInfoClick} 
              disabled={!selectedPlant}
              className={infoHighlighted ? 'highlighted' : ''}
            >
              {showInfo ? 'HIDE INFO' : 'SHOW INFO'}
            </button>
          </div>
          {showInfo && selectedPlant ? (
            <div className="plant-info-text">
              <p>{`Information about ${selectedPlant}`}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget augue eu lacus commodo sodales. Sed at dui in orci egestas vehicula.</p>
            </div>
          ) : (
            <div className="plant-list">
              {plants.map((plant, index) => (
                <div 
                  key={index} 
                  className={`plant-circle ${selectedPlant === plant ? 'selected' : ''}`} 
                  onClick={() => handlePlantClick(plant)}
                >
                  {plant}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="main">
          {selectedPlant && (
            <>
              <div className="plant-img"></div>
              <p className="plant-caption">Caption for {selectedPlant}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plantdex;

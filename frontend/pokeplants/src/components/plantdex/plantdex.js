import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './plantdex.css';

const plants = ['Plant 1', 'Plant 2'];

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
  const [info, setInfo] = useState("");

  useEffect(() => {
    setSelectedPlant(plants[0]);
  }, []);

  const handlePlantClick = async (plant) => {
    setSelectedPlant(plant);
    setShowInfo(false);
    setInfoHighlighted(false);

    try {
      const response = await fetch('http://100.67.199.31:9631/plant-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "plant":plant }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setInfo(data);
      setShowInfo(true); 
    } catch (error) {
      console.error('Error fetching plant info:', error);
    }
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

  const handleAddPlantClick = () => {
    /* ADD BACKEND STUFF HERE */
    console.log("Add Plant Clicked");
  };

  return (
    <div className="plantdex-container">
      <button className="home-button" onClick={handleHomeClick}>HOME</button>
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
              {info ? <p>{info}</p> : <p>No Data Retreived.</p>}
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
              <div 
                className="add-plant-circle"
                onClick={handleAddPlantClick}
              >
                +
              </div>
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

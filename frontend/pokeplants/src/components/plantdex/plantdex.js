import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './plantdex.css';

const plants = ['Plant 1', 'Plant 2'];

const Plantdex = () => {
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [infoHighlighted, setInfoHighlighted] = useState(false);
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('plant-bg');
    return () => {
      document.body.classList.remove('plant-bg');
    };
  }, []);

  useEffect(() => {
    setSelectedPlant(plants[0]);
  }, []);

  const handlePlantClick = async (plant) => {
    setSelectedPlant(plant);
    setShowInfo(false);
    setInfoHighlighted(false);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://100.67.6.78:9631/plant-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plant }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setInfo(data.response);
      setShowInfo(true);
    } catch (error) {
      setError('Error fetching plant info.');
      console.error('Error fetching plant info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoClick = () => {
    setShowInfo((prevShowInfo) => !prevShowInfo);
    setInfoHighlighted((prevInfoHighlighted) => !prevInfoHighlighted);
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            showInfo && selectedPlant ? (
              <div className="plant-info-text">
                <p>{`Information about ${selectedPlant}`}</p>
                {info ? <p>{JSON.stringify(info)}</p> : <p>No Data Retrieved.</p>}
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
            )
          )}
          {error && <p className="error">{error}</p>}
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

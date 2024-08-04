import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './plantdex.css';

const initialPlants = [
  { name: 'Inch Plant', image: `${process.env.PUBLIC_URL}/assets/inchplant.png` },
  { name: 'Peace Lily', image: `${process.env.PUBLIC_URL}/assets/peacelily.png` },
];

const Plantdex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('plant-bg');
    return () => {
      document.body.classList.remove('plant-bg');
    };
  }, []);

  const [plants, setPlants] = useState(initialPlants);
  const [selectedPlant, setSelectedPlant] = useState(initialPlants[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [infoHighlighted, setInfoHighlighted] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedPlant(plants[0]);
  }, [plants]);

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

  const handleAddPlantClick = () => {
    setLoading(true);

    setTimeout(() => {
      const newPlant = {
        name: 'Aloe Vera',
        image: `${process.env.PUBLIC_URL}/assets/aloevera.png`,
      };
      setPlants([...plants, newPlant]);
      setSelectedPlant(newPlant);
      setShowInfo(false);
      setInfoHighlighted(false);
      setShowAddButton(true);
      setLoading(false);
    }, 4000);
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
              <p>{`Information about ${selectedPlant.name}`}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget augue eu lacus commodo sodales. Sed at dui in orci egestas vehicula.</p>
            </div>
          ) : (
            <div className="plant-list">
              {plants.map((plant, index) => (
                <div  
                  key={index} 
                  className={`plant-circle ${selectedPlant.name === plant.name ? 'selected' : ''}`} 
                  onClick={() => handlePlantClick(plant)}
                >
                  <img src={plant.image} alt={plant.name} className="plant-image" />
                </div>
              ))}
              {showAddButton && (
                <div 
                  className={`add-plant-circle ${loading ? 'loading' : ''}`}
                  onClick={handleAddPlantClick}
                >
                  {loading ? (
                    <span className="loading-text">loading...</span>
                  ) : (
                    '+'
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="main">
          {selectedPlant && (
            <>
              <div className="plant-img">
                <img src={selectedPlant.image} alt={selectedPlant.name} />
              </div>
              <p className="plant-caption">{selectedPlant.name}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plantdex;

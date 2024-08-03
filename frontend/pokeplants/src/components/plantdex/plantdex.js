import React, { useState } from 'react';
import './plantdex.css';

const plants = ['Plant 1', 'Plant 2', 'Plant 3'];

const Plantdex = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
  };

  const handleBackClick = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="plantdex-container">
      <h1>PLANTDEX</h1>
      <div className="content">
        <div className="sidebar">
          <div className="toggle-buttons">
            <button onClick={handleBackClick}>list of plants</button>
            <button disabled={!selectedPlant}>info</button>
          </div>
          {!selectedPlant ? (
            <div className="plant-list">
              {plants.map((plant, index) => (
                <div 
                  key={index} 
                  className="plant-circle" 
                  onClick={() => handlePlantClick(plant)}
                ></div>
              ))}
            </div>
          ) : (
            <div className="plant-care-info">
              <p>blah blah blah insert info here</p>
              <p>info blah blah blah</p>
            </div>
          )}
        </div>
        <div className="main">
          {selectedPlant && (
            <>
              <div className="plant-img"></div>
              <p className="plant-caption">blah blah blah insert info here</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plantdex;

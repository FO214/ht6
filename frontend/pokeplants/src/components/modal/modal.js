import React from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, plants, onSelectPlant, isLoadingScreen, elapsedTime }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {isLoadingScreen ? (
          <div className="loading-container">
            <img className='loading-image' src={`${process.env.PUBLIC_URL}/assets/loading.gif`} alt="loading" />
            <p className="stopwatch">IN QUEUE... {elapsedTime}</p>
          </div>
        ) : (
          <>
            <h2>SELECT A PLANT</h2>
            <div className="modal-plant-list">
              {plants.map((plant, index) => (
                <div 
                  key={index}
                  className="modal-plant-item"
                  onClick={() => onSelectPlant(plant)}
                >
                  <p>{plant}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './end-popup.css';

const Modal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>{message}</h2>
        <button className="home-button-popup" onClick={handleHomeClick}>HOME</button>
      </div>
    </div>
  );
};

export default Modal;

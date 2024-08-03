import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './authbutton.css';

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <button
      className="auth-button"
      onClick={() => {
        if (isAuthenticated) {
          logout({ returnTo: window.location.origin });
        } else {
          loginWithRedirect();
        }
      }}
    >
      {isAuthenticated ? 'LOG OUT' : 'LOG IN'}
    </button>
  );
};

export default AuthButton;

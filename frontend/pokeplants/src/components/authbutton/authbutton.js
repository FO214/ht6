import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <button
      onClick={() => {
        if (isAuthenticated) {
          logout({ returnTo: window.location.origin });
        } else {
          loginWithRedirect();
        }
      }}
    >
      {isAuthenticated ? 'Log Out' : 'Log In'}
    </button>
  );
};

export default AuthButton;

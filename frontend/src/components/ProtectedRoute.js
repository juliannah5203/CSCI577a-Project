import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * A route that checks if the user is authenticated. If the user is
 * authenticated, the children will be rendered. If the user is not
 * authenticated, the user will be redirected to the root URL.
 *
 * The route will temporarily render a "Loading..." message while the
 * authentication check is performed.
 *
 * @param {Object} props - The props passed to the component
 * @param {*} props.children - The children elements to render if the user is authenticated
 */
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/auth/current_user', { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.id) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Session check failed:', err);
        setAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/" replace />;
};

// Declare propTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';

import axios from 'axios';
import { AuthContext } from './AuthProvider';
import Loader from '../component/Loader';

const AdminRoute = ({ children }) => {
  const { userr, loading } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userr?.email) {
        try {
          const res = await axios.get('https://assignment-twelve-server-side-eight.vercel.app/api/users');
          const foundUser = res.data.users.find(u => u.email === userr.email);
          setCurrentUser(foundUser);
        } catch (error) {
          console.error('Failed to fetch user data', error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    fetchUserData();
  }, [userr]);

  if (loading || isChecking) {
    return <Loader />;
  }

  if (currentUser?.role === 'admin') {
    return children;
  }

  // Redirect if not admin
  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default AdminRoute;

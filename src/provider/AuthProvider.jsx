import React, { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from '../firebase/firebase.config';

// Create context
export const AuthContext = createContext();
const auth = getAuth(app);

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [userr, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user profile
  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  // Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Track auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    userr,
    setUser,
    createUser,
    updateUser,
    signIn,
    logOut,
    loading,
    setLoading,
  };

  return (
    <AuthContext value={authData}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;

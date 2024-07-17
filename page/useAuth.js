// useAuth.js

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/user', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Origin': 'http://localhost:8081',  // Replace with your frontend URL
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUserData(userData);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error retrieving token or user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:8081',  // Replace with your frontend URL
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.token;

      await AsyncStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login Error:', error);
      throw error; // Propagate error to handle in UI
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserData(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error; // Propagate error to handle in UI
    }
  };

  return { isLoggedIn, userData, loading, login, logout };
};

export default useAuth;

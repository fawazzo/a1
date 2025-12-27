import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // تحميل بيانات المستخدم من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    const userObj = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toLocaleDateString('tr-TR')
    };
    setUser(userObj);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return {
    user,
    isLoggedIn,
    login,
    updateProfile,
    logout
  };
};

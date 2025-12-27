import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Cart
  const [cartItems, setCartItems] = useState([]);

  // User
  const [user, setUser] = useState(null);

  // Favorites
  const [favorites, setFavorites] = useState([]);

  // Orders
  const [orders, setOrders] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedUser = localStorage.getItem('user');
    const savedFavorites = localStorage.getItem('favorites');
    const savedOrders = localStorage.getItem('orders');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Cart functions
  const addToCart = (item) => {
    const existingItem = cartItems.find(ci => ci.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Favorites functions
  const addFavorite = (restaurant) => {
    if (!favorites.find(fav => fav.id === restaurant.id)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  // Orders functions
  const addOrder = (order) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...order,
      date: new Date().toLocaleDateString('tr-TR'),
      status: 'Hazırlanıyor',
      statusCode: 'preparing'
    };
    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status, statusCode) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status, statusCode } : order
    ));
  };

  // Notifications functions
  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      ...notification,
      time: new Date().toLocaleTimeString('tr-TR'),
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // User functions
  const loginUser = (userData) => {
    const userObj = {
      ...userData,
      id: userData?.id ?? Date.now(),
      createdAt: userData?.createdAt ?? new Date().toLocaleDateString('tr-TR')
    };
    setUser(userObj);
  };

  const updateUserProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,

    // Orders
    orders,
    addOrder,
    updateOrderStatus,

    // Notifications
    notifications,
    addNotification,
    markNotificationAsRead,
    deleteNotification,

    // User
    user,
    loginUser,
    updateUserProfile,
    logoutUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

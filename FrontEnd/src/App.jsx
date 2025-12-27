import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RestaurantListPage from './pages/RestaurantListPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import LoginModal from './components/LoginModal';
import Cart from './components/Cart';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerDashboard from './pages/SellerDashboard';
import AddDishPage from './pages/AddDishPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CouponsPage from './pages/CouponsPage';
import FavoritesPage from './pages/FavoritesPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import NotificationsPage from './pages/NotificationsPage';
import FeaturesShowcasePage from './pages/FeaturesShowcasePage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import FavoriteDishesPage from './pages/FavoriteDishesPage';

import { authenticatedFetch, publicFetch } from './utils/api';

// --- Global Context ---
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// --- Auth and Data Provider ---
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [cartError, setCartError] = useState('');
  
  const getAuthToken = () => localStorage.getItem('authToken');

  // --- Auth Functions ---
  const loginUser = (userData, token) => {
    if (token) localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCartItems([]);
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  // --- Cart Functions ---
  const loadCart = async () => {
    const token = getAuthToken();
    if (!token) {
      setCartItems([]);
      setCartError('Lütfen giriş yapın.');
      return;
    }

    try {
      setCartError('');
      const data = await authenticatedFetch('/cart');
      setCartItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      setCartItems([]);
      setCartError(e.message);
    }
  };

  const addToCart = async (item, quantity = 1) => {
    if (!user) return false;

    const restaurantId = item?.restaurant_id;
    if (!restaurantId) {
      throw new Error('Restoran bilgisi bulunamadı.');
    }

    try {
      await authenticatedFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          restaurant_id: restaurantId,
          dish_id: item.id,
          quantity: quantity,
        }),
      });
      await loadCart();
      return true;
    } catch (e) {
      throw new Error(e.message || 'Sepete eklenemedi');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    try {
      await authenticatedFetch(`/cart/remove/${itemId}`, { method: 'DELETE' });
      await loadCart();
    } catch (e) {
      throw new Error(e.message || 'Ürün silinemedi');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await authenticatedFetch('/cart/update', {
        method: 'PATCH',
        body: JSON.stringify({ itemId, quantity }),
      });
      await loadCart();
    } catch (e) {
      throw new Error(e.message || 'Miktar güncellenemedi');
    }
  };

  const createOrder = async ({ payment_method, delivery_address, delivery_fee = 0 }) => {
    if (!user) throw new Error('Lütfen giriş yapın');
    
    try {
      const data = await authenticatedFetch('/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          payment_method,
          delivery_address,
          delivery_fee,
        }),
      });
      await loadCart(); // Clear the cart after successful order
      return data;
    } catch (e) {
      throw new Error(e.message || 'Sipariş oluşturulamadı');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // --- Initial Data Loading (User and Cart) ---
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        const userData = await authenticatedFetch('/auth/me');
        setUser(userData);
        await loadCart();
      } catch (e) {
        // If /me fails, token is likely expired/invalid
        localStorage.removeItem('authToken');
        console.error("Auth Load Error:", e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUserData();
  }, []);

  const contextValue = {
    user,
    isAuthLoading,
    loginUser,
    logoutUser,
    updateUserProfile,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    createOrder,
    loadCart,
    getTotalItems,
    cartError,
  };

  // If we are loading user data, show a simple loading screen
  if (isAuthLoading && getAuthToken()) {
    return <div className="flex items-center justify-center h-screen">Veriler Yükleniyor...</div>;
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// --- Protected Route Wrapper (Optional, but good practice) ---
const ProtectedRoute = ({ element }) => {
  const { user, isAuthLoading } = useAppContext();
  
  if (isAuthLoading) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
  }

  if (!user) {
    // Redirect to home or show login modal if not logged in
    return <Navigate to="/" replace />;
  }

  return element;
};

// --- Main App Component ---
function App() {
  const { user, getTotalItems, addToCart, removeFromCart, updateQuantity, createOrder, loadCart, cartItems } = useAppContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [location, setLocation] = useState('İstanbul, Kadıköy');

  const handleCartClick = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      await loadCart();
      setShowCart(true);
    } catch (e) {
      alert("Sepet yüklenemedi: " + e.message);
    }
  };

  const handleLoginClick = () => {
    if (user) {
      // User is already logged in, maybe show user profile menu later
      return; 
    }
    setShowLoginModal(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} // Pass user data to Header
          onLoginClick={handleLoginClick}
          onCartClick={handleCartClick}
          cartItemCount={getTotalItems()}
          location={location}
          onLocationChange={setLocation}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restoranlar" element={<RestaurantListPage />} />
          <Route 
            path="/restoran/:id" 
            element={<RestaurantDetailPage addToCart={addToCart} />} 
          />
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-dish" element={<AddDishPage />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute element={<UserProfilePage />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<OrderTrackingPage />} />} />
          {/* Mock pages that still exist, but should be protected */}
          <Route path="/coupons" element={<ProtectedRoute element={<CouponsPage />} />} />
          <Route path="/favorites" element={<ProtectedRoute element={<FavoritesPage />} />} />
          <Route path="/tracking" element={<ProtectedRoute element={<LiveTrackingPage />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
          <Route path="/features" element={<FeaturesShowcasePage />} />
          <Route path="/search" element={<AdvancedSearchPage />} />
          <Route path="/favorite-dishes" element={<ProtectedRoute element={<FavoriteDishesPage />} />} />
        </Routes>

        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}

        {showCart && (
          <Cart 
            items={cartItems}
            onClose={() => setShowCart(false)}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onCheckout={createOrder}
          />
        )}
      </div>
    </Router>
  );
}

// Wrap App with the Provider
export default () => (
    <AppProvider>
        <App />
    </AppProvider>
);
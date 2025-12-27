import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [location, setLocation] = useState('İstanbul, Kadıköy');

  const getAuthToken = () => localStorage.getItem('authToken');

  const safeJson = async (res) => {
    if (res.status === 204 || res.status === 304) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  };

  const loadCart = async () => {
    const token = getAuthToken();
    if (!token) {
      setCartItems([]);
      return;
    }

    const res = await fetch(`/api/cart?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });

    const data = await safeJson(res);

    if (res.status === 304) {
      return;
    }
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to load cart');
    }

    setCartItems(Array.isArray(data?.items) ? data.items : []);
  };

  useEffect(() => {
    loadCart().catch(() => {
      setCartItems([]);
    });
  }, []);

  const addToCart = async (item) => {
    const token = getAuthToken();
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const restaurantId = item?.restaurant_id;
    if (!restaurantId) {
      alert('Restoran bilgisi bulunamadı.');
      return;
    }

    const res = await fetch('/api/cart/add', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        dish_id: item.id,
        quantity: 1,
      }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      alert(data?.message || 'Sepete eklenemedi');
      return;
    }

    await loadCart();
  };

  const createOrder = async ({ payment_method, delivery_address, delivery_fee = 0 }) => {
    const token = getAuthToken();
    if (!token) {
      setShowLoginModal(true);
      throw new Error('Lütfen giriş yapın');
    }

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        payment_method,
        delivery_address,
        delivery_fee,
      }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data?.message || 'Sipariş oluşturulamadı');
    }

    await loadCart();
    return data;
  };

  const removeFromCart = async (itemId) => {
    const token = getAuthToken();
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const res = await fetch(`/api/cart/remove/${itemId}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });

    const data = await safeJson(res);
    if (!res.ok) {
      alert(data?.message || 'Ürün silinemedi');
      return;
    }

    await loadCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    const token = getAuthToken();
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const res = await fetch('/api/cart/update', {
      method: 'PATCH',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ itemId, quantity }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      alert(data?.message || 'Miktar güncellenemedi');
      return;
    }

    await loadCart();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onLoginClick={() => setShowLoginModal(true)}
          onCartClick={async () => {
            try {
              await loadCart();
              setShowCart(true);
            } catch (e) {
              alert(e?.message || 'Sepet yüklenemedi');
            }
          }}
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
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/features" element={<FeaturesShowcasePage />} />
          <Route path="/search" element={<AdvancedSearchPage />} />
          <Route path="/favorite-dishes" element={<FavoriteDishesPage />} />
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

export default App;

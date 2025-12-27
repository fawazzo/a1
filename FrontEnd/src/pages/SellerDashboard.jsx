import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff, TrendingUp, ShoppingBag, Star } from 'lucide-react';
import { publicFetch, authenticatedFetch } from '../utils/api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getSellerToken = () => localStorage.getItem('sellerAuthToken');

  // --- Data Fetching Logic ---
  const loadSellerData = useCallback(async (token) => {
    setLoading(true);
    setError('');
    
    try {
      // 1. Get Seller User Info (to verify status and get ID)
      const sellerUser = await authenticatedFetch('/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!sellerUser || sellerUser.is_seller !== 1) {
          throw new Error("Erişim Reddedildi: Yalnızca satıcılar bu sayfaya erişebilir.");
      }
      setSeller(sellerUser);

      // 2. Fetch Seller's Restaurant(s) - NOTE: Backend lacks a /restaurants/seller/:id route
      // We must fetch all restaurants and filter locally, or assume the first one.
      const allRestaurants = await publicFetch('/restaurants');
      const sellerRestaurant = allRestaurants.find(r => r.seller_id === sellerUser.id);
      
      if (!sellerRestaurant) {
          setRestaurant(null);
          // Allow seller to continue, but show a warning that restaurant is missing.
          setLoading(false);
          return;
      }
      setRestaurant(sellerRestaurant);

      // 3. Fetch Dishes
      const loadedDishes = await publicFetch(`/restaurants/${sellerRestaurant.id}/dishes`);
      setDishes(Array.isArray(loadedDishes) ? loadedDishes : []);

      // 4. Fetch Seller Orders
      const loadedOrders = await authenticatedFetch('/orders/seller/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(Array.isArray(loadedOrders) ? loadedOrders : []);


    } catch (err) {
      console.error(err);
      setError(err.message || 'Veri yüklenirken bir hata oluştu.');
      handleLogout(); // Force logout on critical failure
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // --- Initial Load Effect ---
  useEffect(() => {
    const token = getSellerToken();
    if (!token) {
      navigate('/seller/login');
      return;
    }
    loadSellerData(token);
  }, [navigate, loadSellerData]);
  
  // --- Actions ---
  const handleLogout = () => {
    localStorage.removeItem('sellerAuthToken');
    localStorage.removeItem('sellerUser');
    navigate('/seller/login');
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    
    try {
        await authenticatedFetch(`/dishes/${dishId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getSellerToken()}` }
        });
        alert('Ürün başarıyla silindi.');
        // Update local state
        setDishes(dishes.filter(dish => dish.id !== dishId)); 
    } catch (e) {
        alert('Silme işlemi başarısız: ' + (e.message || 'Server error'));
    }
  };

  const toggleAvailability = async (dish) => {
    const newAvailability = dish.is_available === 1 ? 0 : 1;
    
    try {
        await authenticatedFetch(`/dishes/${dish.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${getSellerToken()}` },
            body: JSON.stringify({ 
                ...dish,
                is_available: newAvailability
            })
        });
        // Update local state
        setDishes(dishes.map(d =>
            d.id === dish.id ? { ...d, is_available: newAvailability } : d
        ));
    } catch (e) {
        alert('Durum güncelleme başarısız: ' + (e.message || 'Server error'));
    }
  };

  // --- Stats Calculation ---
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + Number(order.total_price), 0);
  const totalOrders = orders.length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Veriler Yükleniyor...</div>;
  }
  
  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
             <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-lg">
                Hata: {error}
            </div>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
                Giriş Sayfasına Dön
            </button>
        </div>
    );
  }
  
  if (!restaurant) {
      return (
          <div className="min-h-screen bg-gray-50 p-8">
              <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-lg">
                ⚠️ Hesabınız aktif ancak henüz bir restoran oluşturulmamış. Lütfen Müşteri panelinden (Eğer yetkiniz varsa) bir restoran oluşturunuz.
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Çıkış Yap
              </button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{restaurant.name}</h1>
            <p className="text-sm text-gray-600">Satıcı Paneli - Hoş geldiniz, {seller.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Toplam Sipariş</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Toplam Gelir</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalRevenue.toFixed(2).toLocaleString()} ₺</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Aktif Ürün</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{dishes.filter(d => d.is_available === 1).length}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>
        
        {/* Order History Preview */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Son Siparişler ({orders.length})</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">Henüz sipariş yok.</p>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50">
                            <div>
                                <p className="font-semibold text-gray-800">Sipariş #{order.id}</p>
                                <p className="text-sm text-gray-600">Müşteri: {order.user_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">{Number(order.total_price).toFixed(2)} ₺</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Dishes Management */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Ürünler (Restoran ID: {restaurant.id})</h2>
            <Link
              to="/seller/add-dish"
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Ürün Ekle</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ürün Adı</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fiyat</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Durum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {/* Assuming the image is a URL or Base64 string */}
                        <img
                          src={dish.image || 'placeholder.jpg'}
                          alt={dish.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-gray-800">{dish.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{dish.category}</td>
                    <td className="py-3 px-4 font-bold text-primary">{Number(dish.price).toFixed(2)} ₺</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(dish)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition ${
                          dish.is_available === 1
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {dish.is_available === 1 ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Aktif</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">Pasif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {/* Edit Dish Link (Assuming a dedicated edit page) */}
                        <Link
                          to={`/seller/edit-dish/${dish.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dishes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Henüz ürün eklenmemiş</p>
              <Link
                to="/seller/add-dish"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                İlk Ürünü Ekle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
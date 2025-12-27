import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, ShoppingBag, LogOut, Edit2, Save } from 'lucide-react';
import { useAppContext } from '../App';
import { authenticatedFetch } from '../utils/api';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, logoutUser, updateUserProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load user data into edit state upon mount/user change
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
      });
    }
  }, [user]);

  // Mock data for display purposes (Favorites and Orders are currently in localStorage in other components)
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites') || '[]') // Using placeholder local storage list
  );
  
  const [orders, setOrders] = useState([
    // Mock orders display
    {
      id: 'ORD001',
      restaurant: 'Pizza Palace',
      items: 'Margarita Pizza x2, Coca Cola x2',
      total: 150,
      date: '2025-11-15',
      status: 'Teslim Edildi'
    },
  ]);

  const handleSaveProfile = async () => {
    setSaveError('');
    setSaveLoading(true);

    try {
        // NOTE: The backend API digest did not show an endpoint for updating user profile.
        // Assuming we would use a PATCH /api/auth/me endpoint if it existed, or just update local state for demo.
        // Since there is no update endpoint, we'll only update local state for a smooth UX flow,
        // but note that this would need a real API call.

        // Simulate API call success:
        await new Promise(resolve => setTimeout(resolve, 500)); 

        // Update global context state
        updateUserProfile(editData); 
        setIsEditing(false);
    } catch (e) {
        setSaveError(e.message || "Profil güncellenemedi.");
    } finally {
        setSaveLoading(false);
    }
  };

  const removeFavorite = (id) => {
    // This should ideally call a backend API for persistence
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };
  
  if (!user) {
    return <div className="container-custom py-12 text-center text-gray-500">Lütfen giriş yapın.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Profilim</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {saveError}
                </div>
              )}

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition mb-4"
              >
                <Edit2 className="w-4 h-4" />
                <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
              </button>

              {isEditing && (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Ad Soyad"
                  />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="E-posta"
                    disabled // Email usually can't be changed easily
                  />
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Telefon"
                  />
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Adres"
                  />
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                  </button>
                </div>
              )}

              {!isEditing && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-semibold">{user.phone || 'Eklenmedi'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adres:</span>
                    <span className="font-semibold text-right">{user.address || 'Eklenmedi'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Şehir:</span>
                    <span className="font-semibold text-right">{user.city || 'Eklenmedi'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Favorites Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <h3 className="text-xl font-bold text-gray-800">Favorilerim</h3>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Henüz favori restoranınız yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{fav.name}</h4>
                        <p className="text-sm text-gray-600">{fav.cuisine}</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= Math.round(fav.rating)
                                  ? '⭐'
                                  : '☆'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">{fav.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Heart className="w-5 h-5 fill-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Section (Note: For detailed orders, use the /orders page) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-gray-800">Siparişlerim (Son 2)</h3>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Henüz siparış vermediniz</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{order.restaurant}</h4>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sipariş No: {order.id}</span>
                        <span className="font-bold text-primary">{order.total} ₺</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
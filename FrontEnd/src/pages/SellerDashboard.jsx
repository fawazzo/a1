import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff, TrendingUp, ShoppingBag, Star } from 'lucide-react';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: 'Margarita Pizza',
      category: 'Pizza',
      price: 65,
      description: 'Domates, mozzarella, fesleğen',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
      available: true,
      orders: 145
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      category: 'Pizza',
      price: 75,
      description: 'Bol pepperoni, mozzarella',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
      available: true,
      orders: 98
    },
    {
      id: 3,
      name: 'Karışık Pizza',
      category: 'Pizza',
      price: 80,
      description: 'Sucuk, sosis, mantar, biber',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      available: true,
      orders: 156
    }
  ]);

  useEffect(() => {
    const sellerAuth = localStorage.getItem('sellerAuth');
    if (!sellerAuth) {
      navigate('/seller/login');
      return;
    }
    setSeller(JSON.parse(sellerAuth));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('sellerAuth');
    navigate('/seller/login');
  };

  const handleDeleteDish = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setDishes(dishes.filter(dish => dish.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setDishes(dishes.map(dish =>
      dish.id === id ? { ...dish, available: !dish.available } : dish
    ));
  };

  const totalRevenue = dishes.reduce((sum, dish) => sum + (dish.price * dish.orders), 0);
  const totalOrders = dishes.reduce((sum, dish) => sum + dish.orders, 0);

  if (!seller) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{seller.restaurantName}</h1>
            <p className="text-sm text-gray-600">Satıcı Paneli</p>
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
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalRevenue.toLocaleString()} ₺</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Aktif Ürün</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{dishes.filter(d => d.available).length}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Dishes Management */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Ürünler</h2>
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sipariş</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Durum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-gray-800">{dish.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{dish.category}</td>
                    <td className="py-3 px-4 font-bold text-primary">{dish.price} ₺</td>
                    <td className="py-3 px-4 text-gray-600">{dish.orders}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(dish.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition ${
                          dish.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {dish.available ? (
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

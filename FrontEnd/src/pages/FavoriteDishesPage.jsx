import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

const FavoriteDishesPage = () => {
  const [favoriteDishes, setFavoriteDishes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteDishes');
    if (saved) {
      setFavoriteDishes(JSON.parse(saved));
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favoriteDishes.filter(dish => dish.id !== id);
    setFavoriteDishes(updated);
    localStorage.setItem('favoriteDishes', JSON.stringify(updated));
  };

  const addToCart = (dish) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === dish.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...dish, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ الطبق تم إضافته إلى السلة!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">المفضلة من الأطباق</h1>
              <p className="text-sm text-gray-600">{favoriteDishes.length} طبق محفوظ</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {favoriteDishes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">لا توجد أطباق مفضلة</h2>
            <p className="text-gray-600">
              أضف أطباقك المفضلة بالنقر على القلب ❤️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>

                  {/* Favorite Badge */}
                  <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{dish.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-primary font-bold text-xl">{dish.price} ₺</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(dish)}
                      className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>أضف للسلة</span>
                    </button>
                    <button
                      onClick={() => removeFavorite(dish.id)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteDishesPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Trash2 } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Pizza Palace',
      cuisine: 'Pizza, İtalyan',
      rating: 4.8,
      reviews: 1250,
      deliveryTime: '20-30 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: 50,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      addedDate: '2025-11-10'
    },
    {
      id: 2,
      name: 'Kebapçı Halil',
      cuisine: 'Kebap, Türk Mutfağı',
      rating: 4.9,
      reviews: 856,
      deliveryTime: '30-40 dk',
      deliveryFee: '10 ₺',
      minOrder: 75,
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
      addedDate: '2025-11-08'
    },
    {
      id: 3,
      name: 'Tatlı Dünyası',
      cuisine: 'Tatlı, Dondurma',
      rating: 4.7,
      reviews: 542,
      deliveryTime: '15-25 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: 25,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      addedDate: '2025-11-05'
    }
  ]);

  const removeFavorite = (id) => {
    if (window.confirm('Bu restoranı favorilerden çıkarmak istediğinize emin misiniz?')) {
      setFavorites(favorites.filter(fav => fav.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Favorilerim</h1>
            <span className="bg-primary text-white text-sm px-3 py-1 rounded-full font-semibold">
              {favorites.length}
            </span>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz Favori Yok</h2>
            <p className="text-gray-600 mb-6">
              Beğendiğiniz restoranları favorilere ekleyin ve hızlıca erişin
            </p>
            <Link
              to="/restoranlar"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Restoranları Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-lg flex items-center space-x-1 shadow-md">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-sm">{restaurant.rating}</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => removeFavorite(restaurant.id)}
                    className="absolute top-3 left-3 p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{restaurant.cuisine}</p>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <span className="text-primary font-semibold">{restaurant.deliveryFee}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Min. sipariş: {restaurant.minOrder} ₺
                    </div>
                    <div className="text-xs text-gray-500">
                      {restaurant.reviews} değerlendirme
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/restoran/${restaurant.id}`}
                      className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition text-center text-sm"
                    >
                      Menüyü Gör
                    </Link>
                    <button
                      onClick={() => removeFavorite(restaurant.id)}
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

export default FavoritesPage;

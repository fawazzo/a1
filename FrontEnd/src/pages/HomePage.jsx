import { Link } from 'react-router-dom';
import { Search, Pizza, UtensilsCrossed, Coffee, Cake, Leaf, Clock, Star } from 'lucide-react';
import { useState } from 'react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = [
    { name: 'Pizza', icon: Pizza, color: 'bg-red-100 text-red-600' },
    { name: 'Kebap', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600' },
    { name: 'Kahve', icon: Coffee, color: 'bg-amber-100 text-amber-600' },
    { name: 'Tatlı', icon: Cake, color: 'bg-pink-100 text-pink-600' },
    { name: 'Vejetaryen', icon: Leaf, color: 'bg-green-100 text-green-600' },
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: 'Pizza Palace',
      cuisine: 'Pizza, İtalyan',
      rating: 4.8,
      deliveryTime: '20-30 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: '50 ₺',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Kebapçı Halil',
      cuisine: 'Kebap, Türk Mutfağı',
      rating: 4.9,
      deliveryTime: '30-40 dk',
      deliveryFee: '10 ₺',
      minOrder: '75 ₺',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Tatlı Dünyası',
      cuisine: 'Tatlı, Dondurma',
      rating: 4.7,
      deliveryTime: '15-25 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: '40 ₺',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Green Salad Bar',
      cuisine: 'Vejetaryen, Sağlıklı',
      rating: 4.6,
      deliveryTime: '25-35 dk',
      deliveryFee: '8 ₺',
      minOrder: '60 ₺',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
    },
  ];

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              En Sevdiğin Lezzetler Kapında!
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Binlerce restorandan dilediğin yemeği hızlıca sipariş et
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <Search className="w-6 h-6 text-gray-400 mx-3" />
              <input 
                type="text"
                placeholder="Restoran, mutfak veya yemek ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 px-2 outline-none text-gray-800"
              />
              <Link 
                to="/restoranlar"
                className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition"
              >
                Ara
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container-custom mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/restoranlar"
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-3`}>
                <category.icon className="w-8 h-8" />
              </div>
              <span className="font-semibold text-gray-800">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="container-custom mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Öne Çıkan Restoranlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restoran/${restaurant.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-sm">{restaurant.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {restaurant.deliveryTime}
                  </div>
                  <span className="text-primary font-semibold">{restaurant.deliveryFee}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Min. sipariş: {restaurant.minOrder}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="container-custom mt-12">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">İlk Siparişine Özel %30 İndirim!</h2>
          <p className="text-lg mb-4">Hemen sipariş ver, lezzetli fırsatları kaçırma</p>
          <Link 
            to="/restoranlar"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Hemen Sipariş Ver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

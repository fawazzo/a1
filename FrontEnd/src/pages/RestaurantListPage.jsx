import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Filter, ChevronDown, Heart } from 'lucide-react';
import { publicFetch } from '../utils/api'; // Use public fetch

const RestaurantListPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: '',
    deliveryTime: '',
    rating: '',
    minOrder: ''
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [favoriteRestaurants, setFavoriteRestaurants] = useState(
    JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]')
  );

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cuisineTypeFromCuisine = (cuisine = '') => {
    const c = String(cuisine).toLowerCase();
    if (c.includes('pizza')) return 'pizza';
    if (c.includes('kebap') || c.includes('döner') || c.includes('doner')) return 'kebap';
    if (c.includes('burger')) return 'burger';
    if (c.includes('sushi')) return 'sushi';
    if (c.includes('tatl') || c.includes('dessert') || c.includes('sweet')) return 'tatli';
    if (c.includes('vejet') || c.includes('veget')) return 'vejetaryen';
    return '';
  };

  useEffect(() => {
    let cancelled = false;

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await publicFetch('/restaurants');

        const mapped = Array.isArray(data)
          ? data.map((r) => ({
              id: r.id,
              name: r.name,
              cuisine: r.cuisine,
              cuisineType: cuisineTypeFromCuisine(r.cuisine),
              rating: Number(r.rating ?? 0),
              deliveryTimeMin: Number(r.delivery_time_min ?? 0),
              deliveryTimeMax: Number(r.delivery_time_max ?? 0),
              deliveryFee: r.delivery_fee === 0 || r.delivery_fee === '0' ? 'Ücretsiz' : `${r.delivery_fee} ₺`,
              minOrder: Number(r.min_order ?? 0),
              image:
                r.image ||
                'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
            }))
          : [];

        if (!cancelled) {
          setRestaurants(mapped);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load restaurants');
          setRestaurants([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRestaurants();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants.filter(restaurant => {
      if (selectedFilters.cuisine && restaurant.cuisineType !== selectedFilters.cuisine) {
        return false;
      }
      if (selectedFilters.rating) {
        const minRating = parseFloat(selectedFilters.rating);
        if (restaurant.rating < minRating) {
          return false;
        }
      }
      if (selectedFilters.minOrder) {
        const maxOrder = parseInt(selectedFilters.minOrder);
        if (restaurant.minOrder > maxOrder) {
          return false;
        }
      }
      if (selectedFilters.deliveryTime) {
        const avgTime = (restaurant.deliveryTimeMin + restaurant.deliveryTimeMax) / 2;
        if (selectedFilters.deliveryTime === 'fast' && avgTime > 20) {
          return false;
        }
        if (selectedFilters.deliveryTime === 'medium' && (avgTime < 20 || avgTime > 40)) {
          return false;
        }
        if (selectedFilters.deliveryTime === 'slow' && avgTime < 40) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'delivery') {
      filtered.sort((a, b) => {
        const avgA = (a.deliveryTimeMin + a.deliveryTimeMax) / 2;
        const avgB = (b.deliveryTimeMin + b.deliveryTimeMax) / 2;
        return avgA - avgB;
      });
    } else if (sortBy === 'minorder') {
      filtered.sort((a, b) => a.minOrder - b.minOrder);
    }

    return filtered;
  }, [selectedFilters, sortBy, restaurants]);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      cuisine: '',
      deliveryTime: '',
      rating: '',
      minOrder: ''
    });
    setSortBy('recommended');
  };

  const toggleFavoriteRestaurant = (restaurant) => {
    const isFavorited = favoriteRestaurants.some(r => r.id === restaurant.id);
    let updated;
    if (isFavorited) {
      updated = favoriteRestaurants.filter(r => r.id !== restaurant.id);
    } else {
      updated = [...favoriteRestaurants, restaurant];
    }
    setFavoriteRestaurants(updated);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(updated));
  };

  const isFavoriteRestaurant = (restaurantId) => {
    return favoriteRestaurants.some(r => r.id === restaurantId);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-800">Filtreler</h3>
              <Filter className="w-5 h-5 text-gray-600" />
            </div>

            {/* Cuisine Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mutfak Türü
              </label>
              <select 
                value={selectedFilters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="pizza">Pizza</option>
                <option value="kebap">Kebap</option>
                <option value="burger">Burger</option>
                <option value="sushi">Sushi</option>
                <option value="tatli">Tatlı</option>
                <option value="vejetaryen">Vejetaryen</option>
              </select>
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teslimat Süresi
              </label>
              <select 
                value={selectedFilters.deliveryTime}
                onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="fast">Hızlı (0-20 dk)</option>
                <option value="medium">Orta (20-40 dk)</option>
                <option value="slow">Uzun (40+ dk)</option>
              </select>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Puan
              </label>
              <select 
                value={selectedFilters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="4.5">4.5+ Yıldız</option>
                <option value="4.0">4.0+ Yıldız</option>
                <option value="3.5">3.5+ Yıldız</option>
              </select>
            </div>

            {/* Minimum Order */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Sipariş
              </label>
              <select 
                value={selectedFilters.minOrder}
                onChange={(e) => handleFilterChange('minOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Tümü</option>
                <option value="50">50 ₺ ve altı</option>
                <option value="75">75 ₺ ve altı</option>
                <option value="100">100 ₺ ve altı</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Restoranlar <span className="text-gray-500 font-normal">({filteredAndSortedRestaurants.length})</span>
            </h1>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="recommended">Önerilen</option>
              <option value="rating">En Yüksek Puan</option>
              <option value="delivery">En Hızlı Teslimat</option>
              <option value="minorder">Minimum Sipariş</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : filteredAndSortedRestaurants.length > 0 ? (
              filteredAndSortedRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <Link
                    to={`/restoran/${restaurant.id}`}
                    className="block"
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavoriteRestaurant(restaurant);
                        }}
                        className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition ${
                            isFavoriteRestaurant(restaurant.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} dk
                      </div>
                      <span className="text-primary font-semibold">{restaurant.deliveryFee}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Min. sipariş: {restaurant.minOrder} ₺
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Seçili filtrelere uygun restoran bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantListPage;
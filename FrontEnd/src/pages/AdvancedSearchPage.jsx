import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, MapPin, Filter, X } from 'lucide-react';

const AdvancedSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: '',
    rating: '',
    deliveryTime: '',
    priceRange: ''
  });
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('searchHistory') || '[]')
  );

  const allRestaurants = [
    {
      id: 1,
      name: 'Pizza Palace',
      cuisine: 'Pizza, İtalyan',
      rating: 4.8,
      reviews: 1250,
      deliveryTime: '20-30 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: 30,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      tags: ['pizza', 'italyan', 'hızlı']
    },
    {
      id: 2,
      name: 'Kebapçı Halil',
      cuisine: 'Kebap, Türk Mutfağı',
      rating: 4.9,
      reviews: 856,
      deliveryTime: '30-40 dk',
      deliveryFee: '10 ₺',
      minOrder: 60,
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
      tags: ['kebap', 'türk', 'lezzetli']
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
      tags: ['tatlı', 'dondurma', 'taze']
    },
    {
      id: 4,
      name: 'Green Salad Bar',
      cuisine: 'Vejetaryen, Sağlıklı',
      rating: 4.6,
      reviews: 423,
      deliveryTime: '25-35 dk',
      deliveryFee: '8 ₺',
      minOrder: 50,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      tags: ['vejetaryen', 'sağlıklı', 'salata']
    },
    {
      id: 5,
      name: 'Burger King',
      cuisine: 'Burger, Fast Food',
      rating: 4.5,
      reviews: 789,
      deliveryTime: '20-30 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: 40,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      tags: ['burger', 'fastfood', 'hızlı']
    },
    {
      id: 6,
      name: 'Sushi Master',
      cuisine: 'Sushi, Japon',
      rating: 4.9,
      reviews: 634,
      deliveryTime: '35-45 dk',
      deliveryFee: '15 ₺',
      minOrder: 80,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      tags: ['sushi', 'japon', 'premium']
    }
  ];

  const filteredResults = useMemo(() => {
    let results = allRestaurants;

    // Arama sorgusu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.includes(query))
      );
    }

    // Mutfak türü filtresi
    if (selectedFilters.cuisine) {
      results = results.filter(r =>
        r.cuisine.toLowerCase().includes(selectedFilters.cuisine.toLowerCase())
      );
    }

    // Puan filtresi
    if (selectedFilters.rating) {
      const minRating = parseFloat(selectedFilters.rating);
      results = results.filter(r => r.rating >= minRating);
    }

    // Teslimat süresi filtresi
    if (selectedFilters.deliveryTime) {
      results = results.filter(r => {
        const avgTime = parseInt(r.deliveryTime);
        if (selectedFilters.deliveryTime === 'fast') return avgTime <= 20;
        if (selectedFilters.deliveryTime === 'medium') return avgTime > 20 && avgTime <= 35;
        if (selectedFilters.deliveryTime === 'slow') return avgTime > 35;
        return true;
      });
    }

    // Fiyat aralığı filtresi
    if (selectedFilters.priceRange) {
      results = results.filter(r => {
        if (selectedFilters.priceRange === 'cheap') return r.minOrder <= 40;
        if (selectedFilters.priceRange === 'medium') return r.minOrder > 40 && r.minOrder <= 70;
        if (selectedFilters.priceRange === 'expensive') return r.minOrder > 70;
        return true;
      });
    }

    return results;
  }, [searchQuery, selectedFilters]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      cuisine: '',
      rating: '',
      deliveryTime: '',
      priceRange: ''
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-gray-800">Gelişmiş Arama</h1>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Restoran, mutfak veya yemek ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Ara
            </button>
          </div>

          {/* Arama Geçmişi */}
          {searchHistory.length > 0 && !searchQuery && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Son Aramalar</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800">Filtreler</h3>
                <Filter className="w-5 h-5 text-gray-600" />
              </div>

              {/* Mutfak Türü */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mutfak Türü
                </label>
                <select
                  value={selectedFilters.cuisine}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, cuisine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Kebap">Kebap</option>
                  <option value="Burger">Burger</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Tatlı">Tatlı</option>
                </select>
              </div>

              {/* Puan */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Puan
                </label>
                <select
                  value={selectedFilters.rating}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="4.5">4.5+ Yıldız</option>
                  <option value="4.0">4.0+ Yıldız</option>
                  <option value="3.5">3.5+ Yıldız</option>
                </select>
              </div>

              {/* Teslimat Süresi */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teslimat Süresi
                </label>
                <select
                  value={selectedFilters.deliveryTime}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, deliveryTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="fast">Hızlı (≤20 dk)</option>
                  <option value="medium">Orta (20-35 dk)</option>
                  <option value="slow">Uzun (35+ dk)</option>
                </select>
              </div>

              {/* Fiyat Aralığı */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fiyat Aralığı
                </label>
                <select
                  value={selectedFilters.priceRange}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, priceRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  <option value="cheap">Ucuz (≤40 ₺)</option>
                  <option value="medium">Orta (40-70 ₺)</option>
                  <option value="expensive">Pahalı (70+ ₺)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Sonuçlar <span className="text-gray-500 font-normal">({filteredResults.length})</span>
              </h2>
            </div>

            {filteredResults.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-600">
                  Arama kriterlerinize uygun restoran bulunamadı. Filtreleri değiştirmeyi deneyin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    to={`/restoran/${restaurant.id}`}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex gap-4"
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>

                      <div className="flex flex-wrap gap-4 text-sm mb-3">
                        <div className="flex items-center text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-semibold">{restaurant.rating}</span>
                          <span className="text-gray-500 ml-1">({restaurant.reviews})</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {restaurant.deliveryTime}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          Min. {restaurant.minOrder} ₺
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {restaurant.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-lg">{restaurant.deliveryFee}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;

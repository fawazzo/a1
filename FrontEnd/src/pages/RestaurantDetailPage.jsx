import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Info, Plus, Heart } from 'lucide-react';
import RatingReview from '../components/RatingReview';
import ReviewsList from '../components/ReviewsList';
import { publicFetch } from '../utils/api';
import { useAppContext } from '../App'; // Import context

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { addToCart, user } = useAppContext(); // Use global addToCart and user for login check

  const [selectedCategory, setSelectedCategory] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState(
    JSON.parse(localStorage.getItem('favoriteDishes') || '[]')
  );
  // Mock reviews for demo as backend review routes were not seen in digest
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Ahmet K.',
      rating: 5,
      comment: 'Harika pizza! Çok lezzetli ve hızlı teslimat. Kesinlikle tavsiye ederim.',
      date: '2025-11-15',
      verified: true
    },
  ]);
  const [activeTab, setActiveTab] = useState('menu');

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const [restaurantData, dishesData] = await Promise.all([
          publicFetch(`/restaurants/${id}`),
          publicFetch(`/restaurants/${id}/dishes`),
        ]);

        const mappedRestaurant = {
          id: restaurantData.id,
          name: restaurantData.name,
          cuisine: restaurantData.cuisine,
          rating: Number(restaurantData.rating ?? 0),
          reviews: 0, // Placeholder
          deliveryTime:
            restaurantData.delivery_time_min != null && restaurantData.delivery_time_max != null
              ? `${restaurantData.delivery_time_min}-${restaurantData.delivery_time_max} dk`
              : '20-40 dk',
          deliveryFee: restaurantData.delivery_fee === 0 || restaurantData.delivery_fee === '0' ? 'Ücretsiz' : `${restaurantData.delivery_fee} ₺`,
          minOrder: Number(restaurantData.min_order ?? 0),
          address: restaurantData.address ?? 'Adres Bilgisi Yok',
          image:
            restaurantData.image ||
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=400&fit=crop',
        };

        const mappedDishes = Array.isArray(dishesData)
          ? dishesData.map((d) => ({
              id: d.id,
              restaurant_id: Number(id), // IMPORTANT: Pass restaurant_id for cart logic
              name: d.name,
              description: d.description,
              price: Number(d.price ?? 0),
              image:
                d.image ||
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
              category: d.category || 'Menü',
              is_available: d.is_available,
            }))
          : [];

        if (!cancelled) {
          setRestaurant(mappedRestaurant);
          setDishes(mappedDishes.filter(d => d.is_available)); // Show only available dishes
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load restaurant');
          setRestaurant(null);
          setDishes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(dishes.map((d) => d.category || 'Menü')));
    return unique.length > 0 ? unique : ['Menü'];
  }, [dishes]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const dishesByCategory = useMemo(() => {
    return dishes.reduce((acc, dish) => {
      const key = dish.category || 'Menü';
      acc[key] = acc[key] || [];
      acc[key].push(dish);
      return acc;
    }, {});
  }, [dishes]);

  const handleAddToCartClick = async (item) => {
    if (!user) {
        alert("Sipariş vermek için lütfen giriş yapın.");
        return;
    }
    try {
        await addToCart(item, 1);
        setAddedItems([...addedItems, item.id]);
        setTimeout(() => {
            setAddedItems(prev => prev.filter(id => id !== item.id));
        }, 1500);
    } catch (e) {
        alert("Hata: " + e.message);
    }
  };

  // Mock function for frontend demo
  const handleSubmitReview = (review) => {
    setReviews([review, ...reviews]);
  };

  const toggleFavoriteDish = (dish) => {
    const isFavorited = favoriteDishes.some(d => d.id === dish.id);
    let updated;
    if (isFavorited) {
      updated = favoriteDishes.filter(d => d.id !== dish.id);
    } else {
      updated = [...favoriteDishes, dish];
    }
    setFavoriteDishes(updated);
    localStorage.setItem('favoriteDishes', JSON.stringify(updated));
  };

  const isFavoriteDish = (dishId) => {
    return favoriteDishes.some(d => d.id === dishId);
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <p className="text-gray-500 text-lg">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <p className="text-red-600 text-lg">Hata: {error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container-custom py-12">
        <p className="text-gray-500 text-lg">Restoran bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Restaurant Header */}
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 container-custom">
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg mb-3">{restaurant.cuisine}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-semibold">{restaurant.rating}</span>
              {restaurant.reviews ? <span className="ml-1">({restaurant.reviews})</span> : null}
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 mr-1" />
              {restaurant.deliveryTime}
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              <MapPin className="w-4 h-4 mr-1" />
              {restaurant.address}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-orange-50 border-l-4 border-primary py-4 mb-6">
        <div className="container-custom flex items-start">
          <Info className="w-5 h-5 text-primary mr-2 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Teslimat ücreti: {restaurant.deliveryFee}</span>
            <span className="mx-2">•</span>
            <span>Minimum sipariş: {restaurant.minOrder} ₺</span>
          </div>
        </div>
      </div>
      
      {/* Tabs for Menu/Reviews */}
      <div className="container-custom mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 px-6 text-lg font-semibold transition ${
              activeTab === 'menu' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Menü ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-6 text-lg font-semibold transition ${
              activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Değerlendirmeler ({reviews.length})
          </button>
        </div>
      </div>


      {activeTab === 'menu' && (
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Menü Kategorileri</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCategory === category
                          ? 'bg-primary text-white font-semibold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedCategory}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dishesByCategory[selectedCategory]?.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="flex relative">
                      {/* Image with Favorite Button */}
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-32 h-32 object-cover"
                        />
                        {/* Favorite Button on Image */}
                        <button
                          onClick={() => toggleFavoriteDish(item)}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition z-10"
                        >
                          <Heart
                            className={`w-5 h-5 transition ${
                              isFavoriteDish(item.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold text-lg">{item.price} ₺</span>
                          <button
                            onClick={() => handleAddToCartClick(item)}
                            disabled={addedItems.includes(item.id)}
                            className={`text-white px-4 py-2 rounded-lg transition flex items-center space-x-1 ${
                              addedItems.includes(item.id)
                                ? 'bg-green-500 disabled:opacity-80'
                                : 'bg-primary hover:bg-orange-600'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            <span className="font-semibold">
                              {addedItems.includes(item.id) ? '✓ Eklendi' : 'Sepete Ekle'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ReviewsList reviews={reviews} />
                </div>
                <div className="lg:col-span-1">
                    <RatingReview restaurantId={restaurant.id} onSubmitReview={handleSubmitReview} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // تحميل المفضلة من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // حفظ المفضلة في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (restaurant) => {
    if (!favorites.find(fav => fav.id === restaurant.id)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};

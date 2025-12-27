import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';

const AddDishPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    description: '',
    image: ''
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Pizza',
    'Kebap',
    'Burger',
    'Sushi',
    'Tatlı',
    'İçecek',
    'Başlangıçlar',
    'Ana Yemekler',
    'Vejetaryen'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description || !formData.image) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Geçerli bir fiyat giriniz');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newDish = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        available: true,
        orders: 0
      };
      
      const dishes = JSON.parse(localStorage.getItem('sellerDishes') || '[]');
      dishes.push(newDish);
      localStorage.setItem('sellerDishes', JSON.stringify(dishes));
      
      setLoading(false);
      navigate('/seller/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="flex items-center space-x-2 text-primary hover:text-orange-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">Yeni Ürün Ekle</h1>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ürün Resmi
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer block">
                  {preview ? (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPreview('');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-semibold">Resim yüklemek için tıklayın</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Örn: Margarita Pizza"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="Örn: 65"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                name="description"
                placeholder="Ürün hakkında kısa açıklama yazınız..."
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
              >
                {loading ? 'Ekleniyor...' : 'Ürünü Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDishPage;

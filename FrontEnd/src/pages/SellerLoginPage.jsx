import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { publicFetch } from '../utils/api'; // Use publicFetch for auth

const SellerLoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    passwordConfirm: '',
    restaurantName: '', // Stored locally only for registration prompt
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if a seller token already exists (for simple persistence)
  const checkSellerAuth = () => {
      const token = localStorage.getItem('sellerAuthToken');
      if (token) {
          // In a real app, we'd validate this token, but for this project, just navigate.
          navigate('/seller/dashboard');
          return true;
      }
      return false;
  }
  
  // Navigate immediately if already authenticated
  useState(() => {
      checkSellerAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Lütfen e-posta ve şifre giriniz.');
        setLoading(false);
        return;
      }

      try {
        const data = await publicFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (data.user && data.token) {
            // Check if the user is a seller (The backend /login response should ideally include is_seller status)
            // Since we don't have the is_seller status in /login, we must trust the backend protects seller routes.
            
            // NOTE: Storing seller token separately to keep customer and seller sessions distinct
            localStorage.setItem('sellerAuthToken', data.token); 
            // Also save basic user info
            localStorage.setItem('sellerUser', JSON.stringify({ 
                ...data.user, 
                restaurantName: formData.restaurantName || 'Restoran Adı Yok' 
            }));
            
            navigate('/seller/dashboard');
        } else {
            setError('Giriş başarısız. Kullanıcı bilgileri alınamadı.');
        }

      } catch (err) {
        setError(err.message || 'Giriş işlemi başarısız.');
      } finally {
        setLoading(false);
      }

    } else { // Register
      if (!formData.email || !formData.password || !formData.name || !formData.phone) {
        setError('Lütfen tüm zorunlu alanları doldurunuz.');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Şifreler eşleşmiyor');
        setLoading(false);
        return;
      }

      // NOTE: We MUST ensure the payload sends is_seller = 1 for a seller registration
      try {
        const data = await publicFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: formData.address,
                city: '',
                is_seller: 1, // Crucial for seller account
            }),
        });

        // After successful registration, save token and navigate
        localStorage.setItem('sellerAuthToken', data.token);
        localStorage.setItem('sellerUser', JSON.stringify({ 
            ...data.user, 
            restaurantName: formData.restaurantName || 'Yeni Restoran' 
        }));

        // Now attempt to create the restaurant (POST /api/restaurants)
        // If the seller has no restaurant yet, the dashboard will complain.
        // We simulate automatic restaurant creation here for a smooth UX:
        await publicFetch('/restaurants', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${data.token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.restaurantName || "Yeni Restoranım",
                cuisine: "Genel",
                description: "Yeni bir Lezzet Express üyesi.",
                address: formData.address,
                phone: formData.phone,
                // Add minimum required fields from restaurantController.js
                delivery_time_min: 20,
                delivery_time_max: 40,
                min_order: 50,
                delivery_fee: 10,
            }),
        });

        alert('Kayıt başarılı! Restoranınız oluşturuldu.');
        navigate('/seller/dashboard');

      } catch (err) {
        setError(err.message || 'Kayıt işlemi başarısız.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Store className="w-8 h-8 mr-2" />
            <h1 className="text-3xl font-bold">Lezzet Express</h1>
          </div>
          <p className="text-orange-100">Satıcı Paneli</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                !isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Adınız ve soyadınız"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Restoran Adı *
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    placeholder="Restoranınızın adı"
                    value={formData.restaurantName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="05XX XXX XX XX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adres
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Restoranın adresi"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="passwordConfirm"
                    placeholder="••••••••"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition disabled:bg-gray-400"
            >
              {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-4">
            {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            {' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:text-orange-600"
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;
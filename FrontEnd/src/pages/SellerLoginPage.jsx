import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';

const SellerLoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    restaurantName: '',
    phone: '',
    address: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Lütfen tüm alanları doldurunuz');
        setLoading(false);
        return;
      }
      setTimeout(() => {
        localStorage.setItem('sellerAuth', JSON.stringify({
          email: formData.email,
          restaurantName: 'Pizza Palace',
          id: 1
        }));
        setLoading(false);
        navigate('/seller/dashboard');
      }, 1000);
    } else {
      if (!formData.email || !formData.password || !formData.restaurantName || !formData.phone || !formData.address) {
        setError('Lütfen tüm alanları doldurunuz');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Şifreler eşleşmiyor');
        setLoading(false);
        return;
      }
      setTimeout(() => {
        localStorage.setItem('sellerAuth', JSON.stringify({
          email: formData.email,
          restaurantName: formData.restaurantName,
          phone: formData.phone,
          address: formData.address,
          id: Math.random()
        }));
        setLoading(false);
        navigate('/seller/dashboard');
      }, 1000);
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
                    Restoran Adı
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    placeholder="Restoranınızın adı"
                    value={formData.restaurantName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

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
                />
              </div>
            </div>

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

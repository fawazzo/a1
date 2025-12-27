import { useState } from 'react';
import { Gift, Copy, Check, Clock, AlertCircle } from 'lucide-react';

const CouponsPage = () => {
  const [coupons] = useState([
    {
      id: 1,
      code: 'WELCOME30',
      title: 'İlk Siparişe %30 İndirim',
      description: 'Yeni kullanıcılar için özel indirim',
      discount: 30,
      type: 'percent',
      minOrder: 50,
      expiryDate: '2025-12-31',
      used: false,
      active: true
    },
    {
      id: 2,
      code: 'PIZZA50',
      title: 'Pizza Siparişlerine 50 ₺ İndirim',
      description: 'Tüm pizza siparişlerine geçerli',
      discount: 50,
      type: 'fixed',
      minOrder: 100,
      expiryDate: '2025-12-15',
      used: false,
      active: true
    },
    {
      id: 3,
      code: 'SUMMER20',
      title: 'Yaz Kampanyası %20 İndirim',
      description: '100 ₺ ve üzeri siparişlerde',
      discount: 20,
      type: 'percent',
      minOrder: 100,
      expiryDate: '2025-11-30',
      used: true,
      active: false
    },
    {
      id: 4,
      code: 'FREEDELIV',
      title: 'Ücretsiz Teslimat',
      description: 'Tüm siparişlerde teslimat ücreti kaldırılır',
      discount: 0,
      type: 'free_delivery',
      minOrder: 75,
      expiryDate: '2025-12-20',
      used: false,
      active: true
    }
  ]);

  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getDiscountText = (coupon) => {
    if (coupon.type === 'percent') {
      return `%${coupon.discount} İndirim`;
    } else if (coupon.type === 'fixed') {
      return `${coupon.discount} ₺ İndirim`;
    } else if (coupon.type === 'free_delivery') {
      return 'Ücretsiz Teslimat';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-3">
            <Gift className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Kuponlar & İndirimler</h1>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Active Coupons */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Aktif Kuponlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.filter(c => c.active && !isExpired(c.expiryDate)).map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-r from-primary to-orange-500 rounded-xl shadow-lg p-6 text-white overflow-hidden relative"
              >
                {/* Decorative Background */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">{coupon.title}</h3>
                  <p className="text-orange-100 text-sm mb-4">{coupon.description}</p>

                  <div className="bg-white/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
                    <p className="text-xs text-orange-100 mb-1">Kupon Kodu</p>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-bold tracking-wider">{coupon.code}</code>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-2 hover:bg-white/20 rounded-lg transition"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-orange-100">Min. Sipariş: {coupon.minOrder} ₺</p>
                      <p className="text-orange-100 flex items-center space-x-1 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>Bitiş: {coupon.expiryDate}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{getDiscountText(coupon)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expired/Used Coupons */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Süresi Geçen Kuponlar</h2>
          <div className="space-y-3">
            {coupons.filter(c => !c.active || isExpired(c.expiryDate)).map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-lg shadow p-4 opacity-60 border-2 border-dashed border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{coupon.title}</h3>
                    <p className="text-sm text-gray-600">{coupon.code}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      {isExpired(coupon.expiryDate) ? 'Süresi Geçti' : 'Kullanıldı'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Kupon Kullanımı</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Kupon kodunu kopyalayın</li>
            <li>• Sepetinizde "Kupon Kodu" alanına yapıştırın</li>
            <li>• İndirim otomatik olarak uygulanacaktır</li>
            <li>• Her kupon sadece bir kez kullanılabilir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;

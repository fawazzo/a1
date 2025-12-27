import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Gift, Bell, Truck, User, Star, Zap } from 'lucide-react';

const FeaturesShowcasePage = () => {
  const features = [
    {
      icon: User,
      title: 'Profilim',
      description: 'Kişisel bilgilerinizi yönetin ve güncelleyin',
      path: '/profile',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: ShoppingBag,
      title: 'Siparişlerim',
      description: 'Tüm sipariş geçmişinizi ve faturalarınızı görüntüleyin',
      path: '/orders',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Heart,
      title: 'Favorilerim',
      description: 'Beğendiğiniz restoranları kaydedin ve hızlıca erişin',
      path: '/favorites',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Gift,
      title: 'Kuponlar & İndirimler',
      description: 'Özel indirim kodlarını kullanın ve tasarruf edin',
      path: '/coupons',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Truck,
      title: 'Canlı Takip',
      description: 'Siparişinizi gerçek zamanlı olarak takip edin',
      path: '/tracking',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Bell,
      title: 'Bildirimler',
      description: 'Tüm önemli güncellemeleri ve teklifleri alın',
      path: '/notifications',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎉 Yeni Özellikler!
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Lezzet Express'in tüm harika özelliklerini keşfedin
          </p>
          <Link
            to="/restoranlar"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Restoranları Keşfet
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 overflow-hidden group"
              >
                <div className={`${feature.color} p-6 flex items-center justify-center h-32`}>
                  <Icon className="w-16 h-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-primary font-semibold">
                    <span>Keşfet</span>
                    <Zap className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ Neler Yeni?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Geliştirilmiş Profil</h3>
                <p className="text-gray-600">Kişisel bilgilerinizi düzenleyin ve yönetin</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Sipariş Geçmişi</h3>
                <p className="text-gray-600">Tüm sipariş ve fatura bilgilerinize erişin</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Favori Restoranlar</h3>
                <p className="text-gray-600">Beğendiğiniz yerleri kaydedin ve hızlıca bulun</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">İndirim Kodları</h3>
                <p className="text-gray-600">Özel kuponlarla daha ucuz sipariş verin</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Canlı Takip</h3>
                <p className="text-gray-600">Siparişinizi gerçek zamanlı olarak izleyin</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Bildirimler</h3>
                <p className="text-gray-600">Önemli güncellemeleri anında alın</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-orange-500 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Hazır mısınız?</h2>
          <p className="text-orange-100 mb-6">
            Lezzet Express'i keşfetmeye başlayın ve harika yemekleri sipariş edin
          </p>
          <Link
            to="/restoranlar"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Şimdi Başla
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcasePage;

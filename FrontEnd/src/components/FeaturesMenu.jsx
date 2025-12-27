import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingBag, Gift, Bell, Truck, User, Search } from 'lucide-react';

const FeaturesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: Search,
      label: 'Gelişmiş Arama',
      path: '/search',
      description: 'Detaylı arama'
    },
    {
      icon: User,
      label: 'Profilim',
      path: '/profile',
      description: 'Kişisel bilgilerim'
    },
    {
      icon: ShoppingBag,
      label: 'Siparişlerim',
      path: '/orders',
      description: 'Sipariş geçmişi'
    },
    {
      icon: Heart,
      label: 'Favorilerim',
      path: '/favorites',
      description: 'Favori restoranlar'
    },
    {
      icon: Gift,
      label: 'Kuponlar',
      path: '/coupons',
      description: 'İndirim kodları'
    },
    {
      icon: Truck,
      label: 'Sipariş Takip',
      path: '/tracking',
      description: 'Canlı takip'
    },
    {
      icon: Bell,
      label: 'Bildirimler',
      path: '/notifications',
      description: 'Tüm bildirimler'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <span className="font-medium">Menü</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary to-orange-500 text-white">
            <h3 className="font-bold text-lg">Özellikler</h3>
            <p className="text-sm text-orange-100">Tüm hizmetlere erişin</p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.path}
                  to={feature.path}
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-primary"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm text-gray-800">{feature.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesMenu;

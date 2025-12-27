import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, AlertCircle, CheckCircle, Truck } from 'lucide-react';

const LiveTrackingPage = () => {
  const [order] = useState({
    id: 'ORD002',
    restaurant: 'Kebapçı Halil',
    status: 'on_way',
    statusText: 'Yolda',
    items: [
      { name: 'Adana Kebap', qty: 1, price: 75 },
      { name: 'Ayran', qty: 1, price: 10 }
    ],
    total: 85,
    deliveryAddress: 'Kadıköy, İstanbul',
    driver: {
      name: 'Fatma Y.',
      phone: '05XX XXX XX XX',
      vehicle: 'Kırmızı Motosiklet - 34 ABC 123',
      rating: 4.9,
      reviews: 342
    },
    estimatedTime: '12:35',
    currentTime: '12:20',
    progress: 65
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7580,
    lng: 29.0159,
    address: 'Caddebostan Caddesi, Kadıköy'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_way':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'preparing':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_way':
        return <Truck className="w-6 h-6" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />;
      case 'preparing':
        return <Clock className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-gray-800">Siparişi Takip Et</h1>
          <p className="text-sm text-gray-600">Sipariş No: {order.id}</p>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg h-96 flex items-center justify-center text-white relative overflow-hidden mb-6">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-white rounded-full"></div>
              </div>
              <div className="relative text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Harita Görünümü</p>
                <p className="text-sm text-blue-100">{currentLocation.address}</p>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-6">Sipariş Durumu</h3>

              <div className="space-y-4">
                {/* Preparing */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="w-1 h-12 bg-green-500 my-2"></div>
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold text-gray-800">Hazırlandı</h4>
                    <p className="text-sm text-gray-600">12:10 - Restoran tarafından hazırlandı</p>
                  </div>
                </div>

                {/* On Way */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center animate-pulse">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-2"></div>
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold text-gray-800">Yolda</h4>
                    <p className="text-sm text-gray-600">12:20 - Kurye tarafından teslim ediliyor</p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Teslim Edildi</h4>
                    <p className="text-sm text-gray-600">Tahmini: 12:35</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">İlerleme</span>
                  <span className="text-sm font-semibold text-primary">{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Sipariş Detayı</h3>
              <div className="space-y-2 mb-4 pb-4 border-b">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} x{item.qty}</span>
                    <span className="font-semibold">{item.price * item.qty} ₺</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-gray-800">
                <span>Toplam</span>
                <span className="text-primary">{order.total} ₺</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-xl shadow-md p-6 text-white ${getStatusColor(order.status)}`}>
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-bold text-lg">{order.statusText}</h3>
                  <p className="text-sm opacity-90">Tahmini: {order.estimatedTime}</p>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Kurye Bilgisi</h3>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {order.driver.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{order.driver.name}</h4>
                  <div className="flex items-center text-sm text-yellow-500">
                    {'⭐'.repeat(Math.round(order.driver.rating))}
                    <span className="text-gray-600 ml-1">({order.driver.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm">{order.driver.phone}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-800 mb-1">Araç</p>
                  <p>{order.driver.vehicle}</p>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition">
                Kurye Ara
              </button>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Teslimat Adresi</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-800 font-semibold">{order.deliveryAddress}</p>
                  <p className="text-sm text-gray-600 mt-2">Kapıda bırak</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <button className="w-full text-red-600 font-semibold hover:text-red-700 transition">
                Sorun Bildir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;

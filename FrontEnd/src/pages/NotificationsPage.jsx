import { useState } from 'react';
import { Bell, Trash2, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order_confirmed',
      title: 'Siparişiniz Onaylandı',
      message: 'Pizza Palace siparişiniz restoran tarafından onaylandı.',
      time: '5 dakika önce',
      read: false,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      type: 'order_on_way',
      title: 'Siparişiniz Yolda',
      message: 'Kurye Fatma Y. siparişinizi teslim etmek için yolda.',
      time: '2 dakika önce',
      read: false,
      icon: Zap,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Yeni İndirim Fırsatı',
      message: 'İlk siparişine %30 indirim! WELCOME30 kodunu kullan.',
      time: '1 saat önce',
      read: true,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 4,
      type: 'restaurant_update',
      title: 'Favori Restoranın Yeni Menüsü',
      message: 'Pizza Palace yeni pizzalar ekledi. Hemen keşfet!',
      time: '3 saat önce',
      read: true,
      icon: Info,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      type: 'order_delivered',
      title: 'Siparişiniz Teslim Edildi',
      message: 'Siparişiniz başarıyla teslim edildi. Değerlendirme yapmayı unutmayın!',
      time: '1 gün önce',
      read: true,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 6,
      type: 'coupon_expiring',
      title: 'Kupon Süresi Bitiyor',
      message: 'PIZZA50 kuponunun süresi 2 gün içinde bitecek.',
      time: '2 gün önce',
      read: true,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bildirimler</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} okunmamış bildirim</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-primary font-semibold hover:text-orange-600 transition text-sm"
            >
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>
      </header>

      <div className="container-custom py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bildirim Yok</h2>
            <p className="text-gray-600">
              Yeni bildirimler burada görüntülenecektir
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`rounded-xl shadow-md p-4 cursor-pointer transition hover:shadow-lg ${
                    notification.read ? 'bg-white' : 'bg-blue-50 border-l-4 border-primary'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg flex-shrink-0 ${notification.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-bold text-gray-800 ${!notification.read ? 'text-lg' : ''}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

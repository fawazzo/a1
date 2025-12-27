import { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock, Phone, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { authenticatedFetch } from '../utils/api';
import { useAppContext } from '../App';

const OrderTrackingPage = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({});

  const mapStatus = (status) => {
    switch (status) {
      case 'delivered':
        return { label: 'Teslim Edildi', code: 'delivered' };
      case 'on_the_way':
        return { label: 'Yolda', code: 'on_the_way' };
      case 'preparing':
        return { label: 'Hazırlanıyor', code: 'preparing' };
      case 'cancelled':
      case 'canceled':
        return { label: 'İptal Edildi', code: 'cancelled' };
      case 'pending':
      default:
        return { label: 'Beklemede', code: 'pending' };
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    try {
        // Fetch all user orders
        const data = await authenticatedFetch('/orders');
        setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
        setError(e?.message || 'Siparişler yüklenemedi');
    } finally {
        setIsLoading(false);
    }
  };

  const loadOrderDetails = async (orderId) => {
    if (orderDetails[orderId]?.isLoading) return;

    setOrderDetails((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), isLoading: true, error: '' },
    }));

    try {
        const data = await authenticatedFetch(`/orders/${orderId}`);
        setOrderDetails((prev) => ({
            ...prev,
            [orderId]: { 
                isLoading: false, 
                error: '', 
                items: Array.isArray(data?.items) ? data.items : [] 
            },
        }));
    } catch (e) {
        setOrderDetails((prev) => ({
            ...prev,
            [orderId]: { ...(prev[orderId] || {}), isLoading: false, error: e.message || 'Detaylar yüklenemedi' },
        }));
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const uiOrders = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).map((o) => {
      const deliveryFee = Number(o.delivery_fee || 0);
      const finalTotal = Number(o.total_price || 0);
      const subtotal = Math.max(0, finalTotal - deliveryFee);
      const mapped = mapStatus(o.status);
      const details = orderDetails[o.id];
      const items = Array.isArray(details?.items) ? details.items : [];
      const paymentStatus = o.payment_status || 'pending';

      return {
        id: o.id,
        restaurant: o.restaurant_name || `Restaurant #${o.restaurant_id}`,
        status: mapped.label,
        statusCode: mapped.code,
        items,
        total: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        date: new Date(o.created_at).toLocaleDateString('tr-TR') + ' ' + new Date(o.created_at).toLocaleTimeString('tr-TR'),
        estimatedTime: mapped.code === 'delivered' ? new Date(o.updated_at).toLocaleTimeString('tr-TR') : '-',
        actualTime: mapped.code === 'delivered' ? new Date(o.updated_at).toLocaleTimeString('tr-TR') : null,
        address: o.delivery_address,
        paymentStatus: paymentStatus,
        paymentMethod: o.payment_method,
        // Mock driver/phone since backend doesn't provide it yet
        driver: mapped.code === 'on_the_way' ? 'Ahmet Şoför' : null, 
        phone: mapped.code === 'on_the_way' ? '0543 xxx xx xx' : null,
      };
    });
  }, [orders, orderDetails]);

  const getStatusIcon = (statusCode) => {
    switch (statusCode) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'on_the_way':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'preparing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'on_the_way':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'text-green-600 font-semibold';
      case 'failed':
        return 'text-red-600 font-semibold';
      case 'pending':
      default:
        return 'text-yellow-600 font-semibold';
    }
  }

  const handleToggleDetails = (orderId, currentItems) => {
    const nextId = expandedOrderId === orderId ? null : orderId;
    setExpandedOrderId(nextId);
    if (nextId && currentItems.length === 0) {
        loadOrderDetails(orderId);
    }
  };

  const handleCancelOrder = async (orderId) => {
      if (!window.confirm("Bu siparişi iptal etmek istediğinizden emin misiniz?")) return;
      try {
          await authenticatedFetch(`/orders/${orderId}/cancel`, { method: 'PATCH' });
          alert('Sipariş başarıyla iptal edildi.');
          loadOrders(); // Reload the list
      } catch (e) {
          alert('İptal hatası: ' + e.message);
      }
  }

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom py-4">
          <h1 className="text-2xl font-bold text-gray-800">Siparişlerim</h1>
        </div>
      </header>

      <div className="container-custom py-8">
        {isLoading ? (
          <div className="text-gray-600">Yükleniyor...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-semibold">{error}</div>
        ) : uiOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-600">Henüz siparişiniz yok.</div>
        ) : (
          <div className="space-y-6">
          {uiOrders.map((order) => {
              const showDetails = expandedOrderId === order.id;
              const details = orderDetails[order.id];
              const itemsToShow = showDetails && Array.isArray(details?.items) && details.items.length > 0 ? details.items : [];

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{order.restaurant}</h3>
                        <p className="text-sm text-gray-600">Sipariş No: {order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.statusCode)}
                        <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.statusCode)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-600">Ödeme Durumu:</span>
                        <span className={getPaymentColor(order.paymentStatus)}>
                            {order.paymentStatus === 'paid' ? 'Ödendi' : order.paymentStatus === 'failed' ? 'Başarısız' : 'Bekleniyor'} ({order.paymentMethod === 'online' ? 'Online' : 'Nakit'})
                        </span>
                    </div>

                    {/* Simple Timeline (Simplified for this page) */}
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                        {order.statusCode === 'on_the_way' ? (
                            <span className='font-semibold text-blue-600 flex items-center'><Truck className='w-4 h-4 mr-1' /> Teslimat Yolda!</span>
                        ) : order.statusCode === 'delivered' ? (
                            <span className='font-semibold text-green-600 flex items-center'><CheckCircle className='w-4 h-4 mr-1' /> Teslim Edildi: {order.actualTime}</span>
                        ) : (
                            <span>Teslimat Durumu: {order.status}</span>
                        )}
                    </div>
                  </div>

                  {/* Order Items & Toggle Details */}
                  <div className="p-6 border-b">
                    <h4 className="font-semibold text-gray-800 mb-3">Siparişin Detayı</h4>
                    
                    {itemsToShow.length > 0 ? (
                        <div className="space-y-2 mb-4">
                            {itemsToShow.map((item, idx) => {
                                const qty = Number(item.qty ?? item.quantity ?? 0);
                                const price = Number(item.price ?? 0);
                                return (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                            {item.name} x{qty}
                                        </span>
                                        <span className="font-semibold text-gray-800">{(price * qty).toFixed(2)} ₺</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-4">Detayları görmek için butona tıklayın.</p>
                    )}

                    <button
                        onClick={() => handleToggleDetails(order.id, itemsToShow)}
                        disabled={details?.isLoading}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition text-sm"
                    >
                        {details?.isLoading ? 'Yükleniyor...' : showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
                    </button>
                    {details?.error && showDetails && (
                        <div className="text-sm font-semibold text-red-600 mt-2">{details.error}</div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="p-6 bg-gray-50 border-b">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ara Toplam</span>
                        <span className="font-semibold">{order.total} ₺</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Teslimat Ücreti</span>
                        <span className="font-semibold text-green-600">
                          {order.deliveryFee === '0.00' ? 'Ücretsiz' : `${order.deliveryFee} ₺`}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-bold text-gray-800">Toplam</span>
                        <span className="font-bold text-primary text-lg">{(Number(order.total) + Number(order.deliveryFee)).toFixed(2)} ₺</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 bg-gray-50 flex gap-3">
                    {(order.statusCode === 'pending' || order.statusCode === 'preparing') && order.paymentStatus !== 'paid' && (
                        <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                          Siparişi İptal Et
                        </button>
                    )}
                    <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition">
                      Yeniden Sipariş Ver
                    </button>
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition">
                      Fatura İndir
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

export default OrderTrackingPage;
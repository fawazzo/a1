import { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock, Phone, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  const getAuthToken = () => localStorage.getItem('authToken');

  const safeJson = async (res) => {
    if (res.status === 204 || res.status === 304) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'delivered':
        return { label: 'Teslim Edildi', code: 'delivered' };
      case 'on_way':
        return { label: 'Yolda', code: 'on_way' };
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

  const uiOrders = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).map((o) => {
      const deliveryFee = Number(o.delivery_fee || 0);
      const finalTotal = Number(o.total_price || 0);
      const subtotal = Math.max(0, finalTotal - deliveryFee);
      const mapped = mapStatus(o.status);
      const details = orderDetails[o.id];
      const items = Array.isArray(details?.items) ? details.items : [];

      return {
        id: o.id,
        restaurant: o.restaurant_name || `Restaurant #${o.restaurant_id}`,
        status: mapped.label,
        statusCode: mapped.code,
        items,
        total: subtotal,
        deliveryFee,
        date: o.created_at,
        estimatedTime: '-',
        actualTime: null,
        address: o.delivery_address,
        driver: null,
        phone: null,
      };
    });
  }, [orders, orderDetails]);

  const loadOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      setOrders([]);
      setIsLoading(false);
      setError('Lütfen giriş yapın');
      return;
    }

    setIsLoading(true);
    setError('');
    const res = await fetch(`/api/orders?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data?.message || 'Siparişler yüklenemedi');
    }

    setOrders(Array.isArray(data) ? data : []);
    setIsLoading(false);
  };

  const loadOrderDetails = async (orderId) => {
    const token = getAuthToken();
    if (!token) throw new Error('Lütfen giriş yapın');
    if (orderDetails[orderId]?.isLoading) return;

    setOrderDetails((prev) => ({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), isLoading: true, error: '' },
    }));

    const res = await fetch(`/api/orders/${orderId}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    });

    const data = await safeJson(res);
    if (!res.ok) {
      setOrderDetails((prev) => ({
        ...prev,
        [orderId]: { ...(prev[orderId] || {}), isLoading: false, error: data?.message || 'Detaylar yüklenemedi' },
      }));
      return;
    }

    setOrderDetails((prev) => ({
      ...prev,
      [orderId]: { isLoading: false, error: '', items: Array.isArray(data?.items) ? data.items : [] },
    }));
  };

  useEffect(() => {
    loadOrders().catch((e) => {
      setIsLoading(false);
      setOrders([]);
      setError(e?.message || 'Siparişler yüklenemedi');
    });
  }, []);

  const getStatusIcon = (statusCode) => {
    switch (statusCode) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'on_way':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'preparing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'on_way':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="text-red-600 font-semibold">{error}</div>
        ) : uiOrders.length === 0 ? (
          <div className="text-gray-600">Henüz siparişiniz yok.</div>
        ) : (
          <div className="space-y-6">
          {uiOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{order.restaurant}</h3>
                    <p className="text-sm text-gray-600">Sipariş No: {order.id}</p>
                    <p className="text-sm text-gray-600">{order.date || '-'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.statusCode)}
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.statusCode)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Sipariş Verildi</p>
                    <p className="font-semibold text-gray-800">{String(order.date || '').split(' ')[1] || '-'}</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                  <div className="text-center">
                    <p className="text-gray-600">Tahmini Teslimat</p>
                    <p className="font-semibold text-gray-800">{order.estimatedTime}</p>
                  </div>
                  {order.actualTime && (
                    <>
                      <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                      <div className="text-center">
                        <p className="text-gray-600">Teslim Edildi</p>
                        <p className="font-semibold text-green-600">{order.actualTime}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b">
                <h4 className="font-semibold text-gray-800 mb-3">Siparişin Detayı</h4>
                {orderDetails[order.id]?.error ? (
                  <div className="text-sm font-semibold text-red-600 mb-3">{orderDetails[order.id]?.error}</div>
                ) : null}

                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <div className="space-y-2">
                    {order.items.map((item, idx) => {
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
                  <button
                    onClick={async () => {
                      const nextId = expandedOrderId === order.id ? null : order.id;
                      setExpandedOrderId(nextId);
                      if (nextId) {
                        await loadOrderDetails(order.id);
                      }
                    }}
                    disabled={orderDetails[order.id]?.isLoading}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    {orderDetails[order.id]?.isLoading ? 'Yükleniyor...' : 'Detayları Göster'}
                  </button>
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
                      {order.deliveryFee === 0 ? 'Ücretsiz' : `${order.deliveryFee} ₺`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Toplam</span>
                    <span className="font-bold text-primary text-lg">{order.total + order.deliveryFee} ₺</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              {order.driver && (
                <div className="p-6 bg-blue-50 border-t border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Teslimat Bilgisi</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {order.driver.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{order.driver}</p>
                        <p className="text-sm text-gray-600">Kurye</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Yeniden Sipariş Ver
                </button>
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition">
                  Fatura İndir
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;

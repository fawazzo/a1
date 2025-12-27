import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import React from 'react';

const Cart = ({ items, onClose, updateQuantity, removeFromCart, onCheckout }) => {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [checkoutError, setCheckoutError] = React.useState('');

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    if (items.length === 0) return;

    if (!onCheckout) {
      setIsCheckingOut(true);
      setTimeout(() => {
        alert('Siparişiniz başarıyla alındı! Teslimat süresi 30-40 dakika.');
        setIsCheckingOut(false);
        onClose();
      }, 1500);
      return;
    }

    if (!deliveryAddress.trim()) {
      setCheckoutError('Teslimat adresi gerekli');
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await onCheckout({
        payment_method: paymentMethod,
        delivery_address: deliveryAddress.trim(),
        delivery_fee: 0,
      });
      alert(`Sipariş oluşturuldu (ID: ${result?.order_id ?? '-'})`);
      setIsCheckingOut(false);
      onClose();
    } catch (e) {
      setIsCheckingOut(false);
      setCheckoutError(e?.message || 'Sipariş oluşturulamadı');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Sepetim</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Sepetiniz boş</p>
              <p className="text-gray-400 text-sm mt-2">Lezzetli yemekler eklemeye başlayın!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-primary font-bold">{item.price} ₺</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-white rounded-lg shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg transition"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 p-6">
            {checkoutError ? (
              <div className="mb-4 text-sm font-semibold text-red-600">
                {checkoutError}
              </div>
            ) : null}

            <div className="mb-4 grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ödeme Yöntemi</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="cash">Kapıda Nakit</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Teslimat Adresi</label>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Örn: Istanbul / Kadıköy"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Ara Toplam</span>
                <span>{getTotalPrice().toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Teslimat Ücreti</span>
                <span className="text-green-600 font-semibold">Ücretsiz</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold text-gray-800">
                <span>Toplam</span>
                <span className="text-primary">{getTotalPrice().toFixed(2)} ₺</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg disabled:bg-gray-400"
            >
              {isCheckingOut ? 'İşleniyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

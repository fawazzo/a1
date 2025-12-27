import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';

const DishOptions = ({ dishName, dishPrice, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const optionGroups = [
    {
      id: 'size',
      name: 'Boyut',
      required: true,
      options: [
        { id: 'small', name: 'Küçük', price: 0 },
        { id: 'medium', name: 'Orta', price: 10 },
        { id: 'large', name: 'Büyük', price: 20 }
      ]
    },
    {
      id: 'crust',
      name: 'Hamur Türü',
      required: false,
      options: [
        { id: 'thin', name: 'İnce Hamur', price: 0 },
        { id: 'thick', name: 'Kalın Hamur', price: 5 },
        { id: 'stuffed', name: 'Dolgulu Hamur', price: 15 }
      ]
    },
    {
      id: 'extras',
      name: 'Ekstra Malzemeler',
      required: false,
      multiple: true,
      options: [
        { id: 'extra_cheese', name: 'Ekstra Peynir', price: 10 },
        { id: 'extra_sauce', name: 'Ekstra Sos', price: 5 },
        { id: 'mushrooms', name: 'Mantar', price: 8 },
        { id: 'olives', name: 'Zeytin', price: 8 },
        { id: 'pepperoni', name: 'Pepperoni', price: 12 }
      ]
    }
  ];

  const handleOptionSelect = (groupId, optionId) => {
    const group = optionGroups.find(g => g.id === groupId);
    if (group?.multiple) {
      const current = selectedOptions[groupId] || [];
      if (current.includes(optionId)) {
        setSelectedOptions({
          ...selectedOptions,
          [groupId]: current.filter(id => id !== optionId)
        });
      } else {
        setSelectedOptions({
          ...selectedOptions,
          [groupId]: [...current, optionId]
        });
      }
    } else {
      setSelectedOptions({
        ...selectedOptions,
        [groupId]: optionId
      });
    }
  };

  const calculateTotalPrice = () => {
    let total = dishPrice * quantity;

    optionGroups.forEach(group => {
      const selected = selectedOptions[group.id];
      if (selected) {
        if (Array.isArray(selected)) {
          selected.forEach(optionId => {
            const option = group.options.find(o => o.id === optionId);
            if (option) total += option.price * quantity;
          });
        } else {
          const option = group.options.find(o => o.id === selected);
          if (option) total += option.price * quantity;
        }
      }
    });

    return total;
  };

  const handleAddToCart = () => {
    const requiredGroups = optionGroups.filter(g => g.required);
    const allRequiredSelected = requiredGroups.every(g => selectedOptions[g.id]);

    if (!allRequiredSelected) {
      alert('Lütfen tüm zorunlu seçenekleri seçiniz');
      return;
    }

    const item = {
      id: Date.now(),
      name: dishName,
      price: dishPrice,
      quantity,
      options: selectedOptions,
      instructions: specialInstructions,
      totalPrice: calculateTotalPrice()
    };

    onAddToCart(item);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-orange-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{dishName}</h2>
            <p className="text-orange-100">{dishPrice} ₺</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-6">
          {optionGroups.map(group => (
            <div key={group.id}>
              <h3 className="font-bold text-gray-800 mb-3">
                {group.name}
                {group.required && <span className="text-red-500 ml-1">*</span>}
              </h3>

              {group.multiple ? (
                <div className="space-y-2">
                  {group.options.map(option => (
                    <label
                      key={option.id}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={(selectedOptions[group.id] || []).includes(option.id)}
                        onChange={() => handleOptionSelect(group.id, option.id)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="flex-1 ml-3 text-gray-800">{option.name}</span>
                      <span className="text-primary font-semibold">+{option.price} ₺</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {group.options.map(option => (
                    <label
                      key={option.id}
                      className="flex items-center p-3 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      style={{
                        borderColor: selectedOptions[group.id] === option.id ? '#FF6B00' : '#e5e7eb'
                      }}
                    >
                      <input
                        type="radio"
                        name={group.id}
                        checked={selectedOptions[group.id] === option.id}
                        onChange={() => handleOptionSelect(group.id, option.id)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="flex-1 ml-3 text-gray-800">{option.name}</span>
                      <span className="text-primary font-semibold">+{option.price} ₺</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Special Instructions */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Özel Talimatlar</h3>
            <textarea
              placeholder="Örn: Çok soslu olsun, soğan kaldır..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 space-y-4">
          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Adet</span>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-primary">
            <span className="font-bold text-gray-800">Toplam</span>
            <span className="text-2xl font-bold text-primary">{calculateTotalPrice()} ₺</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishOptions;

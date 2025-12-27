import { useState, useEffect } from 'react';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);

  // تحميل الطلبات من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  // حفظ الطلبات في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...order,
      date: new Date().toLocaleDateString('tr-TR'),
      status: 'Hazırlanıyor',
      statusCode: 'preparing'
    };
    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status, statusCode) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status, statusCode } : order
    ));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById
  };
};

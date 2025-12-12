import api from './api';

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getByUser: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  updateStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

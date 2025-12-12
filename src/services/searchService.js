import api from './api';

export const searchService = {
  saveHistory: async (userId, query) => {
    const response = await api.post('/search/history', { userId, query });
    return response.data;
  },

  getHistory: async (userId) => {
    const response = await api.get(`/search/history/${userId}`);
    return response.data;
  },

  clearHistory: async (userId) => {
    const response = await api.delete(`/search/history/${userId}`);
    return response.data;
  }
};

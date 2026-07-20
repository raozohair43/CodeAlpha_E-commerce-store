import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set, get) => ({
  items:   [],
  loading: false,
  error:   null,
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.items || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ error: null });
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      set({ items: data.items || [] });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, message: err.message };
    }
  },
  
  updateItem: async (productId, quantity) => {
    set({ error: null });
    try {
      const { data } = await api.put('/cart', { productId, quantity });
      set({ items: data.items || [] });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, message: err.message };
    }
  },

  removeItem: async (productId) => {
    set({ error: null });
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      set({ items: data.items || [] });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, message: err.message } ;
    }
  },

  clearCart: () => set({ items: [], error: null }),
  clearError: () => set({ error: null }),
}));

export default useCartStore;
import api from './api';
import type { Cart } from '@/types';

export const cartService = {
  async getCart() {
    const response = await api.get<{ success: boolean; data: Cart }>('/cart');
    return response.data;
  },

  async addToCart(productId: number, quantity: number = 1) {
    const response = await api.post<{ success: boolean; data: Cart; message: string }>('/cart', {
      productId,
      quantity
    });
    return response.data;
  },

  async updateCartItem(itemId: number, quantity: number) {
    const response = await api.put<{ success: boolean; data: Cart }>(`/cart/${itemId}`, {
      quantity
    });
    return response.data;
  },

  async removeFromCart(itemId: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`/cart/${itemId}`);
    return response.data;
  }
};
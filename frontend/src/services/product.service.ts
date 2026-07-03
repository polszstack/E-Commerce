import api from './api';
import type { Product, PaginatedResponse } from '@/types';

export const productService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  async getProduct(id: number) {
    const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data;
  },

  async getCategories() {
    const products = await this.getProducts({ limit: 100 });
    const categories = [...new Set(products.data.map(p => p.category))];
    return categories;
  }
};
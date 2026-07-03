<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.category"
            @change="fetchProducts"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="filters.sortBy"
            @change="fetchProducts"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created_at">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Name</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <select
            v-model="filters.sortOrder"
            @change="fetchProducts"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="!loading && products.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
      >
        <router-link :to="`/products/${product.id}`">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                {{ product.category }}
              </span>
              <span v-if="product.discountPercentage > 0" class="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                -{{ product.discountPercentage }}%
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {{ product.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ product.description }}
            </p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-indigo-600">${{ product.price }}</span>
                <span v-if="product.discountPercentage > 0" class="text-sm text-gray-400 line-through ml-2">
                  ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
                </span>
              </div>
              <div class="flex items-center">
                <span class="text-yellow-400">★</span>
                <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
              </div>
            </div>
            <div class="mt-4">
              <button
                @click="addToCart(product.id)"
                class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && products.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg">No products found</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded-md',
          currentPage === page
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'

const cartStore = useCartStore();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
let searchTimeout: any = null;

const filters = ref({
  search: '',
  category: '',
  sortBy: 'created_at',
  sortOrder: 'DESC'
});

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchProducts();
  }, 500);
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await productService.getProducts({
      page: currentPage.value,
      limit: 12,
      search: filters.value.search,
      category: filters.value.category,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder
    });
    products.value = response.data;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    categories.value = await productService.getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const addToCart = async (productId: number) => {
  const success = await cartStore.addToCart(productId);
  if (success) {
    // You could add a toast notification here
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>
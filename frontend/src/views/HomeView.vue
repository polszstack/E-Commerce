<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Discover Amazing
            <span class="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Shop the latest trends with unbeatable prices. Quality products delivered to your doorstep.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/products"
              class="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Shop Now
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              Create Account
            </router-link>
            <router-link
              v-else
              to="/products"
              class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              Browse Products
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Wave SVG -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="category in categories"
          :key="category"
          @click="goToCategory(category)"
          class="group cursor-pointer bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
            <span class="text-2xl">{{ getCategoryIcon(category) }}</span>
          </div>
          <h3 class="font-semibold text-gray-900 capitalize">{{ category }}</h3>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Featured Products</h2>
        <router-link to="/products" class="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center">
          View All
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 animate-pulse">
          <div class="bg-gray-200 rounded-xl h-48 mb-4"></div>
          <div class="bg-gray-200 h-4 rounded mb-2"></div>
          <div class="bg-gray-200 h-4 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <router-link :to="`/products/${product.id}`">
            <div class="relative overflow-hidden">
              <img
                :src="product.thumbnail"
                :alt="product.title"
                class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-if="product.discountPercentage > 0" class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{{ product.discountPercentage }}%
              </div>
            </div>
            <div class="p-5">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {{ product.category }}
                </span>
                <div class="flex items-center text-yellow-400 text-sm">
                  <span>★</span>
                  <span class="text-gray-600 ml-1">{{ product.rating }}</span>
                </div>
              </div>
              <h3 class="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {{ product.title }}
              </h3>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-indigo-600">${{ product.price }}</span>
                </div>
                <button
                  @click.prevent="addToCart(product.id)"
                  class="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transform hover:scale-110 transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '@/services/product.service';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import type { Product } from '@/types';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref(true);

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    beauty: '💄',
    fragrances: '🌸',
    furniture: '🪑',
    groceries: '🛒'
  };
  return icons[category] || '📦';
};

const goToCategory = (category: string) => {
  router.push({ path: '/products', query: { category } });
};

const addToCart = async (productId: number) => {
  await cartStore.addToCart(productId);
};

onMounted(async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productService.getProducts({ limit: 8, sortBy: 'rating', sortOrder: 'DESC' }),
      productService.getCategories()
    ]);
    products.value = productsRes.data;
    categories.value = categoriesRes;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
});
</script>
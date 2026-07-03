<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>

    <!-- Product Details -->
    <div v-if="product" class="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <!-- Product Image -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="max-h-96 rounded-2xl shadow-lg"
          />
        </div>

        <!-- Product Info -->
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
              {{ product.category }}
            </span>
            <span class="text-sm text-gray-500">{{ product.brand }}</span>
          </div>

          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ product.title }}</h1>
          
          <div class="flex items-center gap-4 mb-6">
            <div class="flex items-center">
              <span class="text-yellow-400 text-xl">★</span>
              <span class="text-lg font-semibold ml-1">{{ product.rating }}</span>
            </div>
            <span class="text-gray-400">|</span>
            <span class="text-gray-600">{{ product.reviews?.length || 0 }} reviews</span>
          </div>

          <div class="mb-8">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-indigo-600">${{ product.price }}</span>
              <span v-if="product.discountPercentage" class="text-xl text-gray-400 line-through">
                ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
              </span>
              <span v-if="product.discountPercentage" class="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">
                Save {{ Math.round(product.discountPercentage) }}%
              </span>
            </div>
          </div>

          <p class="text-gray-600 text-lg mb-8 leading-relaxed">{{ product.description }}</p>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-green-50 rounded-xl p-4">
              <span class="text-sm text-green-700 font-semibold">{{ product.availabilityStatus }}</span>
              <p class="text-green-600 text-sm mt-1">{{ product.stock }} in stock</p>
            </div>
            <div class="bg-blue-50 rounded-xl p-4">
              <span class="text-sm text-blue-700 font-semibold">Shipping</span>
              <p class="text-blue-600 text-sm mt-1">{{ product.shippingInformation }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Return Policy</h4>
            <p class="text-gray-600 text-sm">{{ product.returnPolicy }}</p>
          </div>

          <button
            @click="addToCart"
            :disabled="product.stock === 0"
            class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-xl"
          >
            {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
          </button>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="product.reviews?.length" class="border-t border-gray-100 p-8 lg:p-10 bg-gray-50">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div class="space-y-6">
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="bg-white rounded-xl p-6 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ review.reviewerName.charAt(0) }}
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ review.reviewerName }}</h4>
                  <div class="flex text-yellow-400">
                    <span v-for="i in 5" :key="i" :class="i <= review.rating ? '' : 'opacity-30'">★</span>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">{{ new Date(review.date || '').toLocaleDateString() }}</span>
            </div>
            <p class="text-gray-600">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { productService } from '@/services/product.service';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types';

const route = useRoute();
const cartStore = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);

const fetchProduct = async () => {
  try {
    const id = Number(route.params.id);
    const response = await productService.getProduct(id);
    product.value = response.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = async () => {
  if (product.value) {
    await cartStore.addToCart(product.value.id);
  }
};

onMounted(fetchProduct);
</script>
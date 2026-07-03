<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <!-- Not authenticated -->
    <div v-if="!authStore.isAuthenticated" class="text-center py-20">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Please login to view your cart</h2>
      <router-link
        to="/login"
        class="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
      >
        Sign In
      </router-link>
    </div>

    <!-- Loading -->
    <div v-else-if="cartStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!cartStore.cart?.items.length" class="text-center py-20">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
      <router-link
        to="/products"
        class="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
      >
        Browse Products
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.cart.items"
          :key="item.id"
          class="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition-shadow"
        >
          <img :src="item.thumbnail" :alt="item.title" class="w-28 h-28 object-cover rounded-xl" />
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1">{{ item.title }}</h3>
            <p class="text-indigo-600 font-bold text-xl mb-3">${{ item.price }}</p>
            <div class="flex items-center gap-2">
              <button
                @click="updateQuantity(item, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >-</button>
              <span class="w-12 text-center font-semibold">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item, item.quantity + 1)"
                :disabled="item.quantity >= item.stock"
                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >+</button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900 text-xl mb-4">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
        <div class="space-y-3 text-gray-600">
          <div class="flex justify-between"><span>Subtotal</span><span>${{ cartStore.totalAmount.toFixed(2) }}</span></div>
          <div class="flex justify-between"><span>Shipping</span><span class="text-green-600 font-semibold">Free</span></div>
          <div class="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span><span>${{ cartStore.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        <button class="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import type { CartItem } from '@/types';

const authStore = useAuthStore();
const cartStore = useCartStore();

const updateQuantity = async (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1 || newQuantity > item.stock) return;
  await cartStore.addToCart(item.product_id, newQuantity - item.quantity);
};

const removeItem = async (itemId: number) => {
  await cartStore.removeFromCart(itemId);
};

onMounted(() => {
  if (authStore.isAuthenticated) cartStore.fetchCart();
});
</script>
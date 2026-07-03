<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Navigation -->
          <div class="flex items-center space-x-8">
            <router-link to="/" class="flex items-center space-x-2 group">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                E-Shop
              </span>
            </router-link>
            
            <div class="hidden md:flex items-center space-x-1">
              <router-link
                to="/"
                class="px-4 py-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                Home
              </router-link>
              <router-link
                to="/products"
                class="px-4 py-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                Products
              </router-link>
            </div>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-3">
            <!-- Cart Button -->
            <router-link
              to="/cart"
              class="relative p-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
              >
                {{ cartStore.itemCount }}
              </span>
            </router-link>

            <!-- User Menu -->
            <template v-if="authStore.isAuthenticated">
              <div class="relative group">
                <button class="flex items-center space-x-2 p-2 text-gray-700 rounded-lg hover:bg-indigo-50 transition-all duration-200">
                  <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </div>
                  <span class="hidden md:block text-sm font-medium">{{ authStore.user?.username }}</span>
                </button>
              </div>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="min-h-[calc(100vh-4rem)]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">E-Shop</h3>
            <p class="text-gray-600 text-sm">Your one-stop shop for quality products at great prices.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><router-link to="/products" class="hover:text-indigo-600 transition-colors">All Products</router-link></li>
              <li><router-link to="/cart" class="hover:text-indigo-600 transition-colors">Shopping Cart</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>support@eshop.com</li>
              <li>1-800-EShop</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; 2025 E-Shop. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { watch } from 'vue';

const authStore = useAuthStore();
const cartStore = useCartStore();

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    cartStore.fetchCart();
  }
});

function handleLogout() {
  authStore.logout();
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
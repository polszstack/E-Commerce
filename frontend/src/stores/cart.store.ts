import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/cart.service'
import type { Cart, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const items = computed(() => cart.value?.items ?? [])
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const itemCount = computed(() => totalItems.value)
  const totalAmount = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)

  async function fetchCart() {
    loading.value = true
    error.value = null
    try {
      const response = await cartService.getCart()
      cart.value = response.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch cart'
      return false
    } finally {
      loading.value = false
    }
  }

  async function addToCart(productId: number, quantity = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await cartService.addToCart(productId, quantity)
      cart.value = response.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add to cart'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCartItem(itemId: number, quantity: number) {
    loading.value = true
    error.value = null
    try {
      const response = await cartService.updateCartItem(itemId, quantity)
      cart.value = response.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update cart item'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeFromCart(itemId: number) {
    loading.value = true
    error.value = null
    try {
      await cartService.removeFromCart(itemId)
      if (cart.value) {
        cart.value.items = cart.value.items.filter((item: CartItem) => item.id !== itemId)
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove item from cart'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    cart,
    loading,
    error,
    items,
    totalItems,
    itemCount,
    totalAmount,
    isEmpty,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart
  }
})

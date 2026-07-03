import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User, LoginCredentials, RegisterData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(authService.getCurrentUser());
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);
      user.value = response.data!.user;
      localStorage.setItem('token', response.data!.token);
      localStorage.setItem('user', JSON.stringify(response.data!.user));
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData) {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.register(data);
      user.value = response.data!.user;
      localStorage.setItem('token', response.data!.token);
      localStorage.setItem('user', JSON.stringify(response.data!.user));
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    authService.logout();
    user.value = null;
    error.value = null;
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  };
});
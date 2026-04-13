import { defineStore } from 'pinia'
import { login as loginApi, getProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    user: null,
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      const data = await loginApi({ username, password })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('admin_token', data.token)
      return data
    },
    async fetchProfile() {
      if (!this.token) return
      const data = await getProfile()
      this.user = data
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('admin_token')
    },
  },
})

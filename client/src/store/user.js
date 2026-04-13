import { defineStore } from 'pinia';
import { getStorage, setStorage, removeStorage, TOKEN_KEY } from '@/utils/storage';
import { userApi } from '@/api/user';

/**
 * 用户 Store：保存当前登录用户信息与 token。
 * token 同时写入本地存储，保证刷新/重启小程序时仍可携带。
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息对象，未登录时为 null */
    userInfo: null,
    /** 登录态 token */
    token: getStorage(TOKEN_KEY) || '',
  }),
  getters: {
    /** 是否已登录 */
    isLogin: (state) => !!state.token,
  },
  actions: {
    /** 设置用户信息和 token（登录/注册成功后调用） */
    setUser({ userInfo, token }) {
      this.userInfo = userInfo || null;
      this.token = token || '';
      if (token) setStorage(TOKEN_KEY, token);
    },

    /** 使用 token 从后端拉取最新用户信息 */
    async fetchProfile() {
      if (!this.token) return;
      try {
        const profile = await userApi.getProfile();
        this.userInfo = profile;
      } catch (e) {
        // token 无效时清理（request.js 已做 401 跳转）
        if (e && (e.code === 401 || e.statusCode === 401)) {
          this.clear();
        }
      }
    },

    /** 退出登录：清空状态并跳转登录页 */
    logout() {
      this.clear();
      uni.navigateTo({ url: '/pages/login/index' });
    },

    /** 清空用户信息（内部使用） */
    clear() {
      this.userInfo = null;
      this.token = '';
      removeStorage(TOKEN_KEY);
    },
  },
});

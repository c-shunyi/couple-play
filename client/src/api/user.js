import { get, post, put } from './request';

/**
 * 用户相关接口：登录、注册、个人信息。
 */
export const userApi = {
  /** 微信登录（传 wx.login 返回的 code） */
  wxLogin: (code) => post('/user/wx-login', { code }),
  /** 用户名密码登录 */
  login: (username, password) => post('/user/login', { username, password }),
  /** 用户名注册 */
  register: (data) => post('/user/register', data),
  /** 获取个人信息（需登录） */
  getProfile: () => get('/user/profile'),
  /** 更新个人信息（需登录） */
  updateProfile: (data) => put('/user/profile', data),
};

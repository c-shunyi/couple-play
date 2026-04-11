import config from '@/config';
import { getStorage, removeStorage, TOKEN_KEY } from '@/utils/storage';

/**
 * 基于 uni.request 的 Promise 封装。
 *
 * 特性：
 * - baseURL 从 config 读取
 * - 自动携带 Authorization Bearer <token>
 * - 统一响应格式：{ code, message, data }，code !== 0 时 toast + reject
 * - 401 时清理 token 并跳回首页（项目有专门登录页时可改为 reLaunch 到 /pages/login/login）
 * - 支持 loading 开关控制 showLoading/hideLoading
 *
 * @param {object} options
 * @param {string} options.url            必填，相对路径，会拼接到 baseURL 后
 * @param {string} [options.method='GET'] 请求方法
 * @param {object} [options.data]         请求体或 query
 * @param {object} [options.header]       额外请求头
 * @param {boolean}[options.loading=false] 是否显示全屏 loading
 * @param {string} [options.loadingText='加载中...'] loading 文案
 * @returns {Promise<any>} 解析后的 data 字段
 */
export function request(options) {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    loading = false,
    loadingText = '加载中...',
  } = options;

  // 请求拦截：附加 token
  const token = getStorage(TOKEN_KEY);
  const finalHeader = { 'content-type': 'application/json', ...header };
  if (token) {
    finalHeader.Authorization = `Bearer ${token}`;
  }

  if (loading) {
    uni.showLoading({ title: loadingText, mask: true });
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + url,
      method,
      data,
      header: finalHeader,
      timeout: config.timeout,
      success: (res) => {
        // HTTP 层错误
        if (res.statusCode < 200 || res.statusCode >= 300) {
          if (res.statusCode === 401) {
            handleUnauthorized();
          }
          const msg = (res.data && res.data.message) || `请求失败 (${res.statusCode})`;
          showError(msg);
          reject(res);
          return;
        }
        const body = res.data || {};
        // 业务层 code 不等于 0：视为失败
        if (body.code !== 0) {
          if (body.code === 401) {
            handleUnauthorized();
          }
          showError(body.message || '请求出错');
          reject(body);
          return;
        }
        resolve(body.data);
      },
      fail: (err) => {
        showError('网络异常，请稍后再试');
        reject(err);
      },
      complete: () => {
        if (loading) uni.hideLoading();
      },
    });
  });
}

/** 统一错误 toast */
function showError(message) {
  uni.showToast({ title: message, icon: 'none', duration: 2000 });
}

/** 401 处理：清理 token 并回到首页（后续可替换为登录页路由） */
function handleUnauthorized() {
  removeStorage(TOKEN_KEY);
  uni.reLaunch({ url: '/pages/index/index' });
}

/** GET 快捷方式 */
export const get = (url, data, opts = {}) => request({ url, method: 'GET', data, ...opts });
/** POST 快捷方式 */
export const post = (url, data, opts = {}) => request({ url, method: 'POST', data, ...opts });
/** PUT 快捷方式 */
export const put = (url, data, opts = {}) => request({ url, method: 'PUT', data, ...opts });
/** DELETE 快捷方式 */
export const del = (url, data, opts = {}) => request({ url, method: 'DELETE', data, ...opts });

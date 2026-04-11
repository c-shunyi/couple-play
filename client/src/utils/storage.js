/**
 * 本地存储封装：统一收口 uni.xxxStorageSync，便于替换实现或加密。
 */

/**
 * 写入本地存储。
 * @param {string} key 键
 * @param {any} value 任意可序列化值
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value);
  } catch (e) {
    console.error('[storage] setStorage failed:', e);
  }
}

/**
 * 读取本地存储。
 * @param {string} key 键
 * @param {any} [defaultValue] 未命中时的默认值
 * @returns {any}
 */
export function getStorage(key, defaultValue = null) {
  try {
    const val = uni.getStorageSync(key);
    return val === '' || val === undefined ? defaultValue : val;
  } catch (e) {
    console.error('[storage] getStorage failed:', e);
    return defaultValue;
  }
}

/**
 * 删除指定键。
 * @param {string} key 键
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key);
  } catch (e) {
    console.error('[storage] removeStorage failed:', e);
  }
}

/**
 * 清空所有本地存储。谨慎使用。
 */
export function clearStorage() {
  try {
    uni.clearStorageSync();
  } catch (e) {
    console.error('[storage] clearStorage failed:', e);
  }
}

/** token 在本地存储中使用的固定 key */
export const TOKEN_KEY = 'couple_play_token';

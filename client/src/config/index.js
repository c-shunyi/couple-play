/**
 * 全局配置项。根据编译环境区分 API 地址，方便后续部署切换。
 */
const config = {
  // 默认开发环境后端地址
  baseURL: 'http://localhost:8804/api',
  // 请求默认超时时间，单位 ms
  timeout: 10000,
};

// #ifdef MP-WEIXIN
// 生产环境或小程序专用地址可在此覆盖
// config.baseURL = 'https://api.example.com/api';
// #endif

export default config;

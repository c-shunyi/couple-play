import { get, post } from './request';

/**
 * 示例接口包装：对应 server 端 /api/example。
 */
export const exampleApi = {
  /** 健康检查（调用 /api/health） */
  health: () => get('/health'),
  /** 列表 */
  list: () => get('/example'),
  /** 创建 */
  create: (data) => post('/example', data),
};

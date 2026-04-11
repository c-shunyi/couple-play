/**
 * 统一响应格式：{ code, message, data }
 * code = 0 表示成功，其它值表示业务或系统错误。
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

/**
 * 构造成功响应。
 * @param data 业务数据
 * @param message 可选提示文案，默认 "success"
 */
export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data };
}

/**
 * 构造失败响应。
 * @param message 错误描述
 * @param code 错误码，默认 500
 */
export function fail(message: string, code = 500): ApiResponse<null> {
  return { code, message, data: null };
}

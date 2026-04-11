/**
 * 简易日志工具：输出带时间戳的日志前缀，便于在容器/终端中定位。
 * 生产环境可替换为 pino/winston 等专业日志库。
 */
function ts(): string {
  return new Date().toISOString();
}

export const logger = {
  /** 普通信息日志 */
  info: (...args: unknown[]): void => console.log(`[${ts()}] [INFO]`, ...args),
  /** 警告日志 */
  warn: (...args: unknown[]): void => console.warn(`[${ts()}] [WARN]`, ...args),
  /** 错误日志 */
  error: (...args: unknown[]): void => console.error(`[${ts()}] [ERROR]`, ...args),
};

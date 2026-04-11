import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * 全局错误处理中间件：捕获下游异常，统一返回标准错误响应。
 * 必须四个参数才会被 Express 识别为错误处理中间件。
 */
export function errorMiddleware(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error:', err);
  const status = err.status ?? 500;
  res.status(status).json(fail(err.message || 'Internal Server Error', status));
}

/**
 * 404 兜底：未匹配到任何路由时进入，返回标准失败响应。
 */
export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json(fail('Not Found', 404));
}

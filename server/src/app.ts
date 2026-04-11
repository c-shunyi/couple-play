import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import './types'; // 触发 Request 类型扩展

/**
 * 构造并返回 Express 应用实例。
 * 顺序：基础中间件 → /api 路由 → 404 兜底 → 全局错误处理。
 */
export function createApp(): Application {
  const app = express();

  // 基础中间件
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // 所有业务接口统一挂 /api 前缀
  app.use('/api', routes);

  // 404 与错误处理（务必放在最后）
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

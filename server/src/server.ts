import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

/**
 * 服务启动入口：创建 app，监听配置端口。
 * 运行时错误由全局错误中间件处理，进程级异常在此兜底记录。
 */
const app = createApp();

app.listen(config.port, () => {
  logger.info(`Server listening on http://localhost:${config.port}`);
  logger.info(`- Client API prefix:  /api`);
  logger.info(`- Admin  API prefix:  /api/admin`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UnhandledRejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('UncaughtException:', err);
});

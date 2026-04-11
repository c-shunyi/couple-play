import { Router, Request, Response } from 'express';
import exampleRoute from './api/example.route';
import adminUserRoute from './admin/admin-user.route';
import adminExampleRoute from './admin/example.route';
import { success } from '../utils/response';

/**
 * 路由汇总：
 *   /api/health            健康检查
 *   /api/example           客户端 Example CRUD
 *   /api/admin/login       管理员登录（免鉴权）
 *   /api/admin/profile     管理员 profile（需鉴权）
 *   /api/admin/example     管理台 Example CRUD（需鉴权 + 角色校验）
 *
 * Nginx 只需配置一条 location /api 代理规则即可覆盖全部接口。
 */
const router = Router();

// 健康检查
router.get('/health', (_req: Request, res: Response) => {
  res.json(success({ status: 'ok', time: new Date().toISOString() }));
});

// 客户端 API
router.use('/example', exampleRoute);

// 管理台 API
router.use('/admin', adminUserRoute);
router.use('/admin/example', adminExampleRoute);

export default router;

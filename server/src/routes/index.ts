import { Router, Request, Response } from 'express';
import exampleRoute from './api/example.route';
import userRoute from './api/user.route';
import adminUserRoute from './admin/admin-user.route';
import adminExampleRoute from './admin/example.route';
import adminManageUserRoute from './admin/user.route';
import { success } from '../utils/response';

/**
 * 路由汇总：
 *   /api/health                   健康检查
 *   /api/example                  客户端 Example CRUD
 *   /api/user                     客户端用户（登录/注册/个人信息）
 *   /api/admin/login              管理员登录（免鉴权）
 *   /api/admin/profile            管理员 profile（需鉴权）
 *   /api/admin/admin-users        管理员账号 CRUD（需 super_admin）
 *   /api/admin/example            管理台 Example CRUD（需鉴权 + 角色）
 *   /api/admin/users              管理台客户端用户管理（需鉴权 + 角色）
 */
const router = Router();

// 健康检查
router.get('/health', (_req: Request, res: Response) => {
  res.json(success({ status: 'ok', time: new Date().toISOString() }));
});

// 客户端 API
router.use('/example', exampleRoute);
router.use('/user', userRoute);

// 管理台 API
router.use('/admin', adminUserRoute);
router.use('/admin/example', adminExampleRoute);
router.use('/admin/users', adminManageUserRoute);

export default router;

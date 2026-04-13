import { Router } from 'express';
import { adminUserController } from '../../controllers/admin/admin-user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { RoleEnum } from '../../types';

/**
 * 管理员账户相关路由：
 * - POST /api/admin/login           免鉴权
 * - GET  /api/admin/profile         需鉴权
 * - CRUD /api/admin/admin-users     需超级管理员权限
 */
const router = Router();

// 公开
router.post('/login', adminUserController.login);

// 需鉴权
router.get('/profile', authMiddleware, adminUserController.profile);

// 管理员 CRUD（仅 super_admin）
const superAdminGuard = [authMiddleware, roleMiddleware([RoleEnum.SuperAdmin])];
router.get('/admin-users', ...superAdminGuard, adminUserController.list);
router.post('/admin-users', ...superAdminGuard, adminUserController.create);
router.put('/admin-users/:id', ...superAdminGuard, adminUserController.update);
router.delete('/admin-users/:id', ...superAdminGuard, adminUserController.remove);

export default router;

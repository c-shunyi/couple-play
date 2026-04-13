import { Router } from 'express';
import { adminUserManageController } from '../../controllers/admin/user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { RoleEnum } from '../../types';

/**
 * 管理台 —— 客户端用户管理路由：挂载于 /api/admin/users 前缀下。
 * 需要 admin 或 super_admin 角色。
 */
const router = Router();

router.use(authMiddleware, roleMiddleware([RoleEnum.Admin, RoleEnum.SuperAdmin]));

router.get('/', adminUserManageController.list);
router.get('/:id', adminUserManageController.getById);
router.put('/:id/status', adminUserManageController.updateStatus);

export default router;

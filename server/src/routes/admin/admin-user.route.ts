import { Router } from 'express';
import { adminUserController } from '../../controllers/admin/admin-user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

/**
 * 管理员账户相关路由：
 * - POST /api/admin/login    免鉴权
 * - GET  /api/admin/profile  需鉴权
 */
const router = Router();

router.post('/login', adminUserController.login);
router.get('/profile', authMiddleware, adminUserController.profile);

export default router;

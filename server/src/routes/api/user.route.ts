import { Router } from 'express';
import { userController } from '../../controllers/api/user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

/**
 * 客户端用户路由：挂载于 /api/user 前缀下。
 *
 * 公开接口（无需鉴权）：wx-login, register, login
 * 受保护接口（需 JWT）：profile
 */
const router = Router();

// 公开
router.post('/wx-login', userController.wxLogin);
router.post('/register', userController.register);
router.post('/login', userController.login);

// 受保护
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

export default router;

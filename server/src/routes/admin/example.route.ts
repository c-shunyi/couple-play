import { Router } from 'express';
import { adminExampleController } from '../../controllers/admin/example.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { RoleEnum } from '../../types';

/**
 * 管理台 Example 路由：全部接口均需鉴权 + 角色校验（admin / super_admin）。
 * 挂载于 /api/admin/example 前缀下。
 */
const router = Router();

router.use(authMiddleware, roleMiddleware([RoleEnum.Admin, RoleEnum.SuperAdmin]));

router.get('/', adminExampleController.list);
router.post('/', adminExampleController.create);
router.put('/:id', adminExampleController.update);
router.delete('/:id', adminExampleController.remove);

export default router;

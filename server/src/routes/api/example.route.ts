import { Router } from 'express';
import { exampleController } from '../../controllers/api/example.controller';

/**
 * 客户端 Example 路由：挂载于 /api/example 前缀下。
 */
const router = Router();

router.get('/', exampleController.list);
router.get('/:id', exampleController.get);
router.post('/', exampleController.create);

export default router;

import { Request, Response, NextFunction } from 'express';
import { exampleService } from '../../services/example.service';
import { success } from '../../utils/response';

/**
 * 管理台 —— Example 控制器：与客户端共用 service，但走独立的路由和中间件（鉴权+角色校验）。
 */
export const adminExampleController = {
  /** GET /api/admin/example 列表 */
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await exampleService.list();
      res.json(success(list));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/admin/example 创建 */
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const item = await exampleService.create({ title, content });
      res.json(success(item));
    } catch (err) {
      next(err);
    }
  },

  /** PUT /api/admin/example/:id 更新 */
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const item = await exampleService.update(id, req.body);
      res.json(success(item));
    } catch (err) {
      next(err);
    }
  },

  /** DELETE /api/admin/example/:id 删除 */
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await exampleService.remove(id);
      res.json(success(null));
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response, NextFunction } from 'express';
import { exampleService } from '../../services/example.service';
import { success } from '../../utils/response';

/**
 * 客户端 API —— Example 控制器：薄封装，负责解析请求/组装响应，业务交给 service。
 */
export const exampleController = {
  /** GET /api/example 列表 */
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await exampleService.list();
      res.json(success(list));
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/example/:id 详情 */
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const item = await exampleService.get(id);
      res.json(success(item));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/example 创建 */
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const item = await exampleService.create({ title, content });
      res.json(success(item));
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response, NextFunction } from 'express';
import { adminManageUserService } from '../../services/admin-manage-user.service';
import { success, fail } from '../../utils/response';

/**
 * 管理台 —— 客户端用户管理控制器：列表、详情、状态修改。
 */
export const adminUserManageController = {
  /** GET /api/admin/users 用户列表（分页 + 搜索） */
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
      const keyword = req.query.keyword as string | undefined;
      const result = await adminManageUserService.list(page, pageSize, keyword);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/admin/users/:id 用户详情 */
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await adminManageUserService.getById(id);
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  },

  /** PUT /api/admin/users/:id/status 修改用户状态 */
  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body ?? {};
      if (status === undefined || ![0, 1].includes(status)) {
        res.status(400).json(fail('status 必须为 0 或 1', 400));
        return;
      }
      const user = await adminManageUserService.updateStatus(id, status);
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  },
};

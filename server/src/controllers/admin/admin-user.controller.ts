import { Request, Response, NextFunction } from 'express';
import { adminUserService } from '../../services/admin-user.service';
import { success, fail } from '../../utils/response';

/**
 * 管理台 —— 管理员用户控制器：登录、profile、管理员 CRUD。
 */
export const adminUserController = {
  /** POST /api/admin/login 管理员登录（免鉴权） */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body ?? {};
      if (!username || !password) {
        res.status(400).json(fail('username 和 password 不能为空', 400));
        return;
      }
      const result = await adminUserService.login(username, password);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/admin/profile 返回当前 token 对应的管理员信息（需鉴权） */
  profile: async (req: Request, res: Response): Promise<void> => {
    res.json(success(req.user ?? null));
  },

  /** GET /api/admin/admin-users 管理员列表 */
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await adminUserService.list();
      res.json(success(list));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/admin/admin-users 创建管理员 */
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body ?? {};
      if (!username || !password) {
        res.status(400).json(fail('username 和 password 不能为空', 400));
        return;
      }
      const admin = await adminUserService.create({ username, password, role });
      res.json(success(admin));
    } catch (err) {
      next(err);
    }
  },

  /** PUT /api/admin/admin-users/:id 修改管理员 */
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { role, status, password } = req.body ?? {};
      const admin = await adminUserService.update(id, { role, status, password });
      res.json(success(admin));
    } catch (err) {
      next(err);
    }
  },

  /** DELETE /api/admin/admin-users/:id 删除管理员 */
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      // 不允许删除自己
      if (req.user?.id === id) {
        res.status(400).json(fail('不能删除自己', 400));
        return;
      }
      await adminUserService.remove(id);
      res.json(success(null));
    } catch (err) {
      next(err);
    }
  },
};

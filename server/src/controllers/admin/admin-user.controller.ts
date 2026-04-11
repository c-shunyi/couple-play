import { Request, Response, NextFunction } from 'express';
import { adminUserService } from '../../services/admin-user.service';
import { success, fail } from '../../utils/response';

/**
 * 管理台 —— 管理员用户控制器：登录、当前用户信息等。
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
};

import { Request, Response, NextFunction } from 'express';
import { userService } from '../../services/user.service';
import { success, fail } from '../../utils/response';

/**
 * 客户端 API —— 用户控制器：登录、注册、个人信息。
 */
export const userController = {
  /** POST /api/user/wx-login  微信登录（传 code） */
  wxLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body ?? {};
      if (!code) {
        res.status(400).json(fail('code 不能为空', 400));
        return;
      }
      const result = await userService.wxLogin(code);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/user/register  用户名注册 */
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, nickname } = req.body ?? {};
      if (!username || !password) {
        res.status(400).json(fail('username 和 password 不能为空', 400));
        return;
      }
      if (username.length < 3 || username.length > 32) {
        res.status(400).json(fail('用户名长度需在 3~32 之间', 400));
        return;
      }
      if (password.length < 6) {
        res.status(400).json(fail('密码长度不能少于 6 位', 400));
        return;
      }
      const result = await userService.register({ username, password, nickname });
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/user/login  用户名密码登录 */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body ?? {};
      if (!username || !password) {
        res.status(400).json(fail('username 和 password 不能为空', 400));
        return;
      }
      const result = await userService.loginByUsername(username, password);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/user/profile  获取个人信息（需鉴权） */
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  },

  /** PUT /api/user/profile  更新个人信息（需鉴权） */
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, avatar, gender } = req.body ?? {};
      const user = await userService.updateProfile(req.user!.id, { nickname, avatar, gender });
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  },
};

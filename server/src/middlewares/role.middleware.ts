import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response';

/**
 * 角色权限中间件工厂：传入允许访问的角色列表，返回一个 Express 中间件。
 * 必须在 authMiddleware 之后使用，依赖 req.user 已被注入。
 *
 * @example
 *   router.use(authMiddleware, roleMiddleware(['admin','super_admin']))
 */
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json(fail('Forbidden: insufficient role', 403));
      return;
    }
    next();
  };
}

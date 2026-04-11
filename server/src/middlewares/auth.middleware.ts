import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { fail } from '../utils/response';

/**
 * JWT 鉴权中间件：从 Authorization: Bearer <token> 中提取 token，校验后将载荷注入 req.user。
 * 客户端与管理台共用本中间件，具体角色控制交给 roleMiddleware。
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json(fail('Unauthorized: missing token', 401));
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json(fail('Unauthorized: invalid or expired token', 401));
  }
}

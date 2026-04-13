/**
 * 全局类型定义：角色枚举、JWT 载荷，并扩展 Express Request。
 */

/** 管理员角色枚举 */
export enum RoleEnum {
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

/** 账号类型：区分客户端用户和管理员 */
export type AccountType = 'user' | 'admin';

/** JWT 载荷结构 */
export interface AuthPayload {
  /** 用户/管理员 id */
  id: number;
  /** 用户名，便于日志排查 */
  username: string;
  /** 角色标识（user / admin / super_admin） */
  role: string;
  /** 账号类型：区分客户端用户和管理员 */
  type: AccountType;
}

// 扩展 Express Request，注入 user 字段（由 auth 中间件写入）
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

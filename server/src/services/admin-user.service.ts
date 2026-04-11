import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';

/**
 * 管理员用户业务服务：封装登录、密码校验等。
 */
export const adminUserService = {
  /**
   * 管理员登录：根据用户名查找，校验 bcrypt 密码，返回签发后的 token 与用户信息。
   * @throws 用户不存在 / 密码错误 / 账号被禁用 时抛出错误
   */
  login: async (username: string, password: string) => {
    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
      throw Object.assign(new Error('账号或密码错误'), { status: 401 });
    }
    if (user.status !== 1) {
      throw Object.assign(new Error('账号已被禁用'), { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw Object.assign(new Error('账号或密码错误'), { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    return {
      token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  },
};

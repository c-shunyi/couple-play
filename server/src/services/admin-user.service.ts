import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

/**
 * 管理员用户业务服务：登录、CRUD。
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

    const token = signToken({ id: user.id, username: user.username, role: user.role, type: 'admin' });
    return {
      token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  },

  /** 管理员列表（全量，管理员数量通常不多，无需分页） */
  list: async () => {
    return prisma.adminUser.findMany({
      select: { id: true, username: true, role: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { id: 'asc' },
    });
  },

  /** 根据 id 查询 */
  getById: async (id: number) => {
    return prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
  },

  /** 创建管理员 */
  create: async (data: { username: string; password: string; role?: string }) => {
    const exists = await prisma.adminUser.findUnique({ where: { username: data.username } });
    if (exists) {
      throw Object.assign(new Error('用户名已存在'), { status: 400 });
    }
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const admin = await prisma.adminUser.create({
      data: { username: data.username, passwordHash, role: data.role || 'admin' },
    });
    return { id: admin.id, username: admin.username, role: admin.role, status: admin.status };
  },

  /** 更新管理员（可修改角色、状态、密码） */
  update: async (id: number, data: { role?: string; status?: number; password?: string }) => {
    const updateData: Record<string, unknown> = {};
    if (data.role !== undefined) updateData.role = data.role;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    return prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true, status: true, updatedAt: true },
    });
  },

  /** 删除管理员 */
  remove: async (id: number) => {
    return prisma.adminUser.delete({ where: { id } });
  },
};

import { prisma } from '../prisma/client';

/**
 * 管理台 —— 客户端用户管理服务：列表查询、详情、状态修改。
 */
export const adminManageUserService = {
  /**
   * 分页查询用户列表，支持按昵称或用户名关键词搜索。
   * @param page 页码（从 1 开始）
   * @param pageSize 每页条数
   * @param keyword 可选关键词
   */
  list: async (page = 1, pageSize = 20, keyword?: string) => {
    const where = keyword
      ? {
          OR: [
            { nickname: { contains: keyword } },
            { username: { contains: keyword } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: { id: true, username: true, nickname: true, avatar: true, gender: true, status: true, createdAt: true },
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { total, page, pageSize, items };
  },

  /** 用户详情 */
  getById: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, openid: true, username: true, nickname: true, avatar: true, gender: true, status: true, createdAt: true, updatedAt: true },
    });
    if (!user) {
      throw Object.assign(new Error('用户不存在'), { status: 404 });
    }
    return user;
  },

  /** 修改用户状态（启用/禁用） */
  updateStatus: async (id: number, status: number) => {
    return prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, status: true, updatedAt: true },
    });
  },
};

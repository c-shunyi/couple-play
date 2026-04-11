import { prisma } from '../prisma/client';

/**
 * Example 业务服务：统一封装对 Prisma 的 CRUD 调用，供客户端 API 与管理台 API 共用。
 */
export const exampleService = {
  /** 列表查询（按创建时间倒序） */
  list: async () => {
    return prisma.example.findMany({ orderBy: { createdAt: 'desc' } });
  },

  /** 根据 id 查询单条 */
  get: async (id: number) => {
    return prisma.example.findUnique({ where: { id } });
  },

  /** 创建一条记录 */
  create: async (data: { title: string; content?: string }) => {
    return prisma.example.create({ data });
  },

  /** 根据 id 更新记录 */
  update: async (id: number, data: { title?: string; content?: string }) => {
    return prisma.example.update({ where: { id }, data });
  },

  /** 根据 id 删除记录 */
  remove: async (id: number) => {
    return prisma.example.delete({ where: { id } });
  },
};

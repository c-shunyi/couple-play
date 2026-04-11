import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient 单例：避免在 ts-node-dev 热重载时创建多个连接池。
 * 生产环境直接 new PrismaClient() 也是单例，但开发环境使用 globalThis 缓存。
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

import dotenv from 'dotenv';

// 加载 .env 到 process.env
dotenv.config();

/**
 * 应用配置汇总：集中管理环境变量读取，避免在业务代码中散落 process.env。
 */
export const config = {
  /** HTTP 端口，默认 3000 */
  port: Number(process.env.PORT) || 3000,
  /** MySQL 连接串，Prisma 运行时读取 */
  databaseUrl: process.env.DATABASE_URL || '',
  /** JWT 签名密钥 */
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  /** JWT 过期时间，例如 "7d" "12h" */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  /** 微信小程序 AppID */
  wxAppId: process.env.WX_APPID || '',
  /** 微信小程序 AppSecret */
  wxSecret: process.env.WX_SECRET || '',
};

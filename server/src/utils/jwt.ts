import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import type { AuthPayload } from '../types';

/**
 * 签发 JWT Token。
 * @param payload 载荷，通常包含用户 id 与角色
 * @returns 签名后的 token 字符串
 */
export function signToken(payload: AuthPayload): string {
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, config.jwtSecret, options);
}

/**
 * 验证并解析 JWT Token。
 * @param token 客户端传入的 token 字符串
 * @returns 解析后的载荷
 * @throws 验证失败时抛出异常
 */
export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, config.jwtSecret) as AuthPayload;
}

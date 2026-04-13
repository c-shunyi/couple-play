import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';
import { config } from '../config';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 10;

/**
 * 客户端用户业务服务：微信登录、用户名注册/登录、个人信息。
 */
export const userService = {
  /**
   * 微信登录：用小程序 code 换取 openid，自动注册或登录。
   * @param code 前端 wx.login() 获取的临时凭证
   */
  wxLogin: async (code: string) => {
    // 调用微信 code2Session 接口
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wxAppId}&secret=${config.wxSecret}&js_code=${code}&grant_type=authorization_code`;
    const resp = await fetch(url);
    const data = (await resp.json()) as { openid?: string; errcode?: number; errmsg?: string };

    if (!data.openid) {
      logger.error('wx code2Session failed:', data);
      throw Object.assign(new Error(data.errmsg || '微信登录失败'), { status: 401 });
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({ where: { openid: data.openid } });
    if (!user) {
      user = await prisma.user.create({
        data: { openid: data.openid, nickname: '微信用户' },
      });
    }

    if (user.status !== 1) {
      throw Object.assign(new Error('账号已被禁用'), { status: 403 });
    }

    const token = signToken({ id: user.id, username: user.nickname, role: 'user', type: 'user' });
    return {
      token,
      user: { id: user.id, nickname: user.nickname, avatar: user.avatar, gender: user.gender },
    };
  },

  /**
   * 用户名注册：创建新用户。
   * @throws 用户名已被占用时抛出 400
   */
  register: async (data: { username: string; password: string; nickname?: string }) => {
    const exists = await prisma.user.findUnique({ where: { username: data.username } });
    if (exists) {
      throw Object.assign(new Error('用户名已被占用'), { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        nickname: data.nickname || data.username,
      },
    });

    const token = signToken({ id: user.id, username: user.username!, role: 'user', type: 'user' });
    return {
      token,
      user: { id: user.id, nickname: user.nickname, avatar: user.avatar, gender: user.gender },
    };
  },

  /**
   * 用户名密码登录。
   * @throws 账号不存在 / 密码错误 / 被禁用 时抛出错误
   */
  loginByUsername: async (username: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.passwordHash) {
      throw Object.assign(new Error('账号或密码错误'), { status: 401 });
    }
    if (user.status !== 1) {
      throw Object.assign(new Error('账号已被禁用'), { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw Object.assign(new Error('账号或密码错误'), { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username!, role: 'user', type: 'user' });
    return {
      token,
      user: { id: user.id, nickname: user.nickname, avatar: user.avatar, gender: user.gender },
    };
  },

  /** 获取用户资料 */
  getProfile: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, openid: false, username: true, nickname: true, avatar: true, gender: true, createdAt: true },
    });
    if (!user) {
      throw Object.assign(new Error('用户不存在'), { status: 404 });
    }
    return user;
  },

  /** 更新用户资料（昵称、头像、性别） */
  updateProfile: async (userId: number, data: { nickname?: string; avatar?: string; gender?: number }) => {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, nickname: true, avatar: true, gender: true },
    });
  },
};

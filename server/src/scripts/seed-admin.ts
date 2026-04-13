import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';

/**
 * 初始化超级管理员账号。
 * 用法：npx ts-node src/scripts/seed-admin.ts
 */
async function main() {
  const username = 'admin';
  const password = 'admin123';
  const role = 'super_admin';

  const exists = await prisma.adminUser.findUnique({ where: { username } });
  if (exists) {
    console.log(`管理员 "${username}" 已存在，跳过创建。`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.adminUser.create({
    data: { username, passwordHash, role },
  });

  console.log('初始超级管理员创建成功：');
  console.log(`  用户名：${username}`);
  console.log(`  密码：${password}`);
  console.log(`  角色：${role}`);
  console.log(`  ID：${user.id}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

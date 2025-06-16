// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const password = '123456';
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'igor.weege@osirnet.com.br' },
    update: {},
    create: {
      name: 'Igor Weege',
      email: 'igor.weege@osirnet.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const commonUser = await prisma.user.upsert({
    where: { email: 'luiza.brum@osirnet.com.br' },
    update: {},
    create: {
      name: 'Luiza Brum',
      email: 'luiza.brum@osirnet.com.br',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Seeding finished.');
  console.log({ adminUser, commonUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
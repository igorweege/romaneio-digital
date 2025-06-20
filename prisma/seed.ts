// prisma/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const emailAdmin = 'igor@osirnet.com.br';
  
  // Apaga o usuário se ele já existir, para podermos rodar o script várias vezes
  // Isso evita erros caso o usuário já tenha sido criado.
  await prisma.user.delete({ where: { email: emailAdmin } }).catch(() => {
    console.log('Admin user not found, creating a new one...');
  });

  const hashedPassword = await bcrypt.hash('Mudar1234', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Igor Weege',
      email: emailAdmin,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Created admin user: ${admin.name} (ID: ${admin.id})`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
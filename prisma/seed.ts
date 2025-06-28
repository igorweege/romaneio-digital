// prisma/seed.ts - VERSÃO ATUALIZADA COM SUPER ADMIN

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const emailAdmin = 'ti@osirnet.com.br';
  
  // Apaga o usuário se ele já existir, para podermos rodar o script várias vezes
  await prisma.user.delete({ where: { email: emailAdmin } }).catch(() => {
    console.log('Super Admin user not found, creating a new one...');
  });

  // A senha continua sendo a mesma para facilitar, você pode alterá-la depois
  const hashedPassword = await bcrypt.hash('Mudar1234', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin TI Osirnet', // Nome do super admin
      email: emailAdmin,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Created admin user: ${admin.name} (${admin.email})`);
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
// app/api/users/route.ts - VERSÃO COM LOG DE CRIAÇÃO

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createLogEntry } from '@/lib/logging';

const userSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  role: z.enum(['USER', 'ADMIN']),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Apenas Admins podem criar novos usuários
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  const json = await request.json();
  const validatedFields = userSchema.safeParse(json);

  if (!validatedFields.success) {
    return NextResponse.json({ errors: validatedFields.error.format() }, { status: 400 });
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Um usuário com este email já existe.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // AQUI A ADIÇÃO DO LOG
    await createLogEntry({
      userId: session.user.id,
      message: `Criou o novo usuário '${newUser.name}' (${newUser.email}) com a permissão '${newUser.role}'.`,
      action: 'USER_CREATED'
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error("Falha ao criar usuário:", error);
    return NextResponse.json({ error: 'Falha ao criar usuário no banco de dados.' }, { status: 500 });
  }
}
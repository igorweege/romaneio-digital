// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // 1. Proteger a rota: Apenas admins podem criar usuários
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  try {
    // 2. Pegar os dados do corpo da requisição
    const body = await request.json();
    const { name, email, password, role } = body;

    // 3. Validação básica dos campos
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // 4. Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 409 }); // 409 = Conflito
    }

    // 5. Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Criar o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 7. Retornar sucesso (sem retornar a senha)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 = Criado

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
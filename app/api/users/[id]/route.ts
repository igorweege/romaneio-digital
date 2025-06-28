// app/api/users/[id]/route.ts - VERSÃO COM GET E PATCH

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createLogEntry } from '@/lib/logging';
import bcrypt from 'bcryptjs';

// ---- NOVA FUNÇÃO GET ----
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Remove a senha do objeto antes de enviar como resposta
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("Falha ao buscar usuário:", error);
    return NextResponse.json({ error: 'Erro ao buscar dados do usuário.' }, { status: 500 });
  }
}


// ---- FUNÇÃO PATCH QUE JÁ TÍNHAMOS ----
const updateUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  role: z.enum(['USER', 'ADMIN']),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional().or(z.literal('')),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  const userId = params.id;
  const json = await request.json();
  
  const validatedFields = updateUserSchema.safeParse(json);
  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error.format() }, { status: 400 });
  }
  
  const { name, role, password } = validatedFields.data;

  try {
    const userBeforeUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userBeforeUpdate) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const dataToUpdate: { name: string; role: 'USER' | 'ADMIN'; password?: string } = {
      name,
      role,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    
    if (userBeforeUpdate.role !== updatedUser.role) {
      await createLogEntry({
        userId: session.user.id,
        message: `Alterou a permissão do usuário '${updatedUser.name}' de '${userBeforeUpdate.role}' para '${updatedUser.role}'.`,
        action: 'USER_ROLE_CHANGED'
      });
    } else if (password) {
        await createLogEntry({
            userId: session.user.id,
            message: `Alterou a senha do usuário '${updatedUser.name}'.`,
            action: 'USER_UPDATED'
        });
    } else {
       await createLogEntry({
        userId: session.user.id,
        message: `Atualizou os dados do usuário '${updatedUser.name}'.`,
        action: 'USER_UPDATED'
      });
    }
    
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Falha ao atualizar usuário:", error);
    return NextResponse.json({ error: 'Falha ao atualizar usuário no banco de dados.' }, { status: 500 });
  }
}
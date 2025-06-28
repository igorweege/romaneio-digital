// app/api/users/[id]/route.ts - VERSÃO COM ATUALIZAÇÃO DE SENHA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createLogEntry } from '@/lib/logging';
import bcrypt from 'bcryptjs'; // Importamos o bcrypt para a senha

// Schema agora inclui um campo de senha opcional
const updateUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  role: z.enum(['USER', 'ADMIN']),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional(),
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

    // Prepara os dados para atualização
    const dataToUpdate: { name: string; role: 'USER' | 'ADMIN'; password?: string } = {
      name,
      role,
    };

    // --- NOVA LÓGICA DE SENHA ---
    // Se uma nova senha foi fornecida, criptografa e adiciona aos dados a serem atualizados
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }
    // --- FIM DA LÓGICA DE SENHA ---

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    
    // Lógica de Log
    if (userBeforeUpdate.role !== updatedUser.role) {
      await createLogEntry({
        userId: session.user.id,
        message: `Alterou a permissão do usuário '${updatedUser.name}' de '${userBeforeUpdate.role}' para '${updatedUser.role}'.`
      });
    } else if (password) {
        await createLogEntry({
            userId: session.user.id,
            message: `Alterou a senha do usuário '${updatedUser.name}'.`
        });
    } else {
       await createLogEntry({
        userId: session.user.id,
        message: `Atualizou os dados do usuário '${updatedUser.name}'.`
      });
    }
    
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Falha ao atualizar usuário:", error);
    return NextResponse.json({ error: 'Falha ao atualizar usuário no banco de dados.' }, { status: 500 });
  }
}
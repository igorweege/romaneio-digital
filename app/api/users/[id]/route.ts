// app/api/users/[id]/route.ts - VERSÃO COM LOG DE ALTERAÇÃO DE ROLE

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createLogEntry } from '@/lib/logging'; // Importamos nossa função

const updateUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  role: z.enum(['USER', 'ADMIN']),
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
  
  const { name, role } = validatedData.data;

  try {
    // 1. Pega o estado do usuário ANTES da atualização
    const userBeforeUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userBeforeUpdate) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // 2. Atualiza o usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        role,
      },
    });

    // 3. Compara as roles e cria o log se houver mudança
    if (userBeforeUpdate.role !== updatedUser.role) {
      await createLogEntry({
        userId: session.user.id, // O admin que fez a ação
        message: `Alterou a permissão do usuário '${updatedUser.name}' de '${userBeforeUpdate.role}' para '${updatedUser.role}'.`
      });
    } else {
      // Log genérico de atualização se a role não mudou
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
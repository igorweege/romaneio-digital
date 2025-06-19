// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Zod Schema para validar os dados de entrada
const updateUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  role: z.enum(['USER', 'ADMIN']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  // 1. Proteção: Apenas administradores podem atualizar usuários
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  const userId = params.id;
  const json = await request.json();

  // 2. Validação: Verifica se os dados recebidos são válidos
  const validatedFields = updateUserSchema.safeParse(json);

  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error.format() }, { status: 400 });
  }
  
  const { name, role } = validatedFields.data;

  try {
    // 3. Atualização: Encontra o usuário e atualiza os dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        role,
      },
    });
    
    // 4. Resposta: Retorna o usuário atualizado com sucesso
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Falha ao atualizar usuário:", error);
    return NextResponse.json({ error: 'Falha ao atualizar usuário no banco de dados.' }, { status: 500 });
  }
}
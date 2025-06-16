// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // <-- MUDANÇA 1: IMPORTAÇÃO ADICIONADA

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  const userIdToDelete = params.id;

  if (session.user.id === userIdToDelete) {
    return NextResponse.json({ error: 'Você não pode excluir sua própria conta de administrador.' }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: userIdToDelete,
      },
    });

    return NextResponse.json({ message: 'Usuário excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    
    // MUDANÇA 2: USANDO O 'Prisma' IMPORTADO
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Função para lidar com requisições DELETE para /api/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Proteger a rota: Apenas admins podem deletar usuários
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  const userIdToDelete = params.id;

  // 2. Regra de negócio: Um admin não pode se auto-deletar
  if (session.user.id === userIdToDelete) {
    return NextResponse.json({ error: 'Você não pode excluir sua própria conta de administrador.' }, { status: 400 });
  }

  try {
    // 3. Deletar o usuário do banco de dados
    await prisma.user.delete({
      where: {
        id: userIdToDelete,
      },
    });

    // 4. Retornar sucesso
    return NextResponse.json({ message: 'Usuário excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    // Verifica se o erro é porque o usuário não foi encontrado
    if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
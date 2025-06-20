// app/admin/page.tsx - VERSÃO CORRIGIDA

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UsersTable from '@/components/UsersTable';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard'); // Redireciona não-admins para o dashboard
  }

  const users = await prisma.user.findMany();

  // Mapeia os usuários para garantir que os dados são serializáveis
  const serializableUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(), // Converte Date para string
  }));

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Adicione, edite ou remova usuários do sistema.
          </p>
        </div>
        <div>
          <Link
            href="/admin/novo-usuario"
            className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
          >
            Adicionar Novo Usuário
          </Link>
        </div>
      </div>

      <UsersTable initialUsers={serializableUsers} />
    </div>
  );
}
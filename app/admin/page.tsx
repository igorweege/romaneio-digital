// app/admin/page.tsx - Layout Unificado

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UsersTable from '@/components/UsersTable';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany();

  const serializableUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
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
              className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
            >
              Adicionar Novo Usuário
            </Link>
          </div>
        </div>

        <UsersTable initialUsers={serializableUsers} />
      </div>
    </div>
  );
}
// app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UsersTable from '@/components/UsersTable';
import SignOutButton from '@/components/SignOutButton';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* CABEÇALHO PADRÃO */}
      <header className="bg-osirnet-blue shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:opacity-80">
                Romaneio Digital
              </Link>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-300">Olá, {session.user.name}</span>
               <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      
      {/* CONTEÚDO PRINCIPAL */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Painel Administrativo</h1>
                    <p className="mt-1 text-gray-600">Gerencie usuários e configurações do sistema.</p>
                </div>
            </div>

            {/* Tabela de Usuários */}
            <div className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                    <a href="/admin/novo-usuario" className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
                        + Adicionar Usuário
                    </a>
                </div>
                
                <UsersTable initialUsers={users} />
            </div>
        </div>
      </main>
    </div>
  );
}
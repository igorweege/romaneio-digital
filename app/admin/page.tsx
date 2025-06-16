// app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UsersTable from '@/components/UsersTable'; // Importamos nosso novo componente

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // A página busca os dados no servidor
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="mt-2 text-lg text-gray-600">Bem-vindo, {session.user?.name}.</p>

        <div className="mt-8 p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
            <a
              href="/admin/novo-usuario"
              className="inline-flex items-center gap-x-2 rounded-md bg-osirnet-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue"
            >
              Adicionar Usuário
            </a>
          </div>
          
          {/* A mágica acontece aqui: passamos os dados para o componente interativo */}
          <UsersTable initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
// app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma'; // Precisamos importar o prisma para acessar o banco

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Lógica de segurança simplificada
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // --- NOVA PARTE: BUSCAR OS USUÁRIOS NO BANCO DE DADOS ---
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc', // Ordenar por mais recente
    },
  });
  // --------------------------------------------------------

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="mt-2 text-lg text-gray-600">Bem-vindo, {session.user?.name}.</p>

        <div className="mt-8 p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
          {/* --- INÍCIO DA ALTERAÇÃO --- */}
<div className="flex justify-between items-center border-b pb-4">
  <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
  <a
    href="/admin/novo-usuario"
    className="inline-flex items-center gap-x-2 rounded-md bg-osirnet-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue"
  >
    Adicionar Usuário
  </a>
</div>
{/* --- FIM DA ALTERAÇÃO --- */}

          {/* --- NOVA PARTE: TABELA DE USUÁRIOS --- */}
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data de Criação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{user.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-700/10'
                              : 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* ------------------------------------------- */}
        </div>
      </div>
    </div>
  );
}
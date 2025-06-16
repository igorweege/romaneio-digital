// app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  // 1. Pega a sessão do usuário no lado do servidor.
  const session = await getServerSession(authOptions);

  // 2. Primeira verificação: o usuário está logado?
  if (!session) {
    redirect('/login');
  }

  // 3. Segunda verificação (a mais importante): o usuário é um ADMIN?
  if (session.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // 4. Se o usuário passou por todas as verificações, ele pode ver esta página.
  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="mt-2 text-lg text-gray-600">Bem-vindo, {session.user?.name}.</p>
        <p className="mt-1 text-sm text-gray-500">Esta página só pode ser vista por administradores.</p>

        <div className="mt-10 p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
          <div className="mt-4 p-4 border-t">
            <p className="text-gray-600">
              {/* No futuro, aqui listaremos os usuários existentes e teremos
                  botões para adicionar, editar ou remover usuários. */}
              A lista de usuários aparecerá aqui...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo ao Dashboard!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Olá, {session.user?.name}!
        </p>
        <p className="mt-1 text-md text-gray-500">
          Seu nível de acesso é: <strong>{session.user?.role}</strong>
        </p>

        {/* --- INÍCIO DA NOVA PARTE --- */}
        <div className="mt-8 border-t pt-8 flex flex-col items-center gap-4">
          <a href="/romaneios/novo" className="rounded-md bg-osirnet-blue px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue">
            + Enviar Novo Romaneio
          </a>
          
          {/* Link para o painel de admin, que só vai funcionar se o usuário for ADMIN */}
          {session.user.role === 'ADMIN' && (
            <a href="/admin" className="text-sm font-semibold text-gray-600 hover:text-osirnet-blue">
              Acessar Painel Administrativo
            </a>
          )}
        </div>
        {/* --- FIM DA NOVA PARTE --- */}

        <SignOutButton />
      </div>
    </div>
  );
}
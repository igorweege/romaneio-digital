// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton'; // Importando nosso botão

export default async function DashboardPage() {
  // Pega a sessão do usuário no lado do servidor.
  const session = await getServerSession(authOptions);

  // Se não houver sessão (usuário não logado), redireciona para a página de login.
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
        
        <SignOutButton />
      </div>
    </div>
  );
}
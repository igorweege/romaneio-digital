// app/login/page.tsx - VERSÃO CORRIGIDA E COMPLETA

import LoginForm from '@/components/LoginForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function LoginPage() {
  // Se o usuário já está logado, não tem por que ele ver a tela de login.
  // Redirecionamos ele para o dashboard.
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/'); // Redireciona para a raiz, que por sua vez o levará ao dashboard
  }

  return <LoginForm />;
}
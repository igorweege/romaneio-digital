// app/page.tsx - VERSÃO COM IMPORTAÇÃO CORRIGIDA

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth'; // Caminho corrigido aqui

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Se o usuário já estiver logado, redireciona para o dashboard.
  if (session) {
    redirect('/dashboard');
  }

  // Se não houver sessão, redireciona para a página de login.
  redirect('/login');
  
  return null;
}
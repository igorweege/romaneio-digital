// app/login/page.tsx - LAYOUT AJUSTADO 65/35

import LoginForm from '@/components/LoginForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      {/* Coluna da Esquerda (Formulário) - Agora com 1/3 da tela e fundo verde */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:w-1/3 lg:flex-none lg:px-20 xl:px-24 bg-osirnet-green">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-left mb-8">
                 <h1 className="text-3xl font-bold tracking-tight text-white">
                    Sistema de Romaneio Digital
                 </h1>
                 <p className="mt-2 text-sm text-gray-200">
                    Por favor, insira suas credenciais para continuar.
                 </p>
            </div>
            <LoginForm />
        </div>
      </div>

      {/* Coluna da Direita (Branding) - Agora com 2/3 e fundo amarelo */}
      <div className="relative flex-1 hidden w-0 lg:block lg:w-2/3">
        <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center bg-osirnet-yellow">
           <Image
              src="/logo-osirnet.png"
              alt="Osirnet"
              width={400}
              height={200}
            />
        </div>
      </div>
    </div>
  );
}
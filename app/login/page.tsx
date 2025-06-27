// app/login/page.tsx - NOVO LAYOUT COM CORES OFICIAIS

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
    <div className="flex min-h-screen bg-white">
      {/* Coluna da Esquerda (Branding) */}
      <div className="relative flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 hidden md:flex bg-osirnet-yellow">
         <div className="mx-auto w-full max-w-sm lg:w-96">
            <Image
              src="/Osirnet_logo_prioritário-fundo-amarelo.png"
              alt="Osirnet"
              width={300} // Aumentei o logo como solicitado
              height={150}
            />
        </div>
      </div>

      {/* Coluna da Direita (Formulário) */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-left mb-8">
                 <h1 className="text-3xl font-bold tracking-tight text-osirnet-dark-blue">
                    Sistema de Romaneio Digital
                 </h1>
                 <p className="mt-2 text-sm text-gray-500">
                    Por favor, insira suas credenciais para continuar.
                 </p>
            </div>
            <LoginForm />
        </div>
      </div>
    </div>
  );
}
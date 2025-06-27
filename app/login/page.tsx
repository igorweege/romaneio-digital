// app/login/page.tsx - LAYOUT AJUSTADO

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
      {/* Coluna da Esquerda (Formulário) - Agora ocupando 1/4 da tela em desktops */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:w-1/4 lg:flex-none lg:px-20 xl:px-24">
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

      {/* Coluna da Direita (Branding) - Agora ocupando 3/4 e escondida em telas pequenas */}
      <div className="relative flex-1 hidden w-0 lg:block lg:w-3/4">
        <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center bg-osirnet-yellow">
           <Image
              src="/logo-osirnet.png"
              alt="Osirnet"
              width={400} // Ajustei o tamanho para a área maior
              height={200}
            />
        </div>
      </div>
    </div>
  );
}
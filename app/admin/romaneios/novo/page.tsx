// app/admin/romaneios/novo/page.tsx - VERSÃO ATUALIZADA

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NovoRomaneioForm from '@/components/NovoRomaneioForm'; // Importamos o formulário

export default async function NovoRomaneioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Adicionar Novo Romaneio</h1>
        <p className="mt-2 text-sm text-gray-600">
          Preencha os dados abaixo para criar um novo registro de romaneio.
        </p>
        
        <div className="mt-8 p-8 bg-white rounded-lg shadow-md border">
          {/* Usamos nosso componente de formulário aqui */}
          <NovoRomaneioForm />
        </div>
      </div>
    </div>
  );
}
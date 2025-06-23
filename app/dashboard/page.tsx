// app/dashboard/page.tsx - VERSÃO COM DADOS SIMPLIFICADOS

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import RomaneiosTable from '@/components/RomaneiosTable';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // 1. Busca os dados incluindo o nome do autor
  const romaneiosFromDb = await prisma.romaneio.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
        author: {
            select: {
                name: true,
            },
        },
    },
    take: 10,
  });

  // 2. AQUI A MUDANÇA: Mapeamos os dados para um formato simples
  const romaneios = romaneiosFromDb.map(romaneio => ({
    ...romaneio,
    // Garantimos que 'createdAt' seja uma string, que é um tipo simples
    createdAt: romaneio.createdAt.toISOString(), 
    // Se o autor não existir, garantimos um valor padrão
    authorName: romaneio.author?.name || 'Desconhecido',
  }));
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo de volta, {session.user.name}!
          </p>
        </div>
        <div>
          <Link
            href="/romaneios/novo"
            className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
          >
            Adicionar Novo Romaneio
          </Link>
        </div>
      </div>
      
      <RomaneiosTable romaneios={romaneios} baseUrl={baseUrl} />

    </div>
  );
}
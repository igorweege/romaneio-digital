// app/romaneios/page.tsx - VERSÃO COM BUSCA GERAL

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import RomaneiosTable from '@/components/RomaneiosTable';
import FilterControls from '@/components/FilterControls';

interface RomaneiosPageProps {
  searchParams: {
    search?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default async function RomaneiosPage({ searchParams }: RomaneiosPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // AQUI A MUDANÇA: A cláusula 'where' não filtra mais por autor.
  // Ela está pronta para receber apenas os filtros de pesquisa.
  const whereClause: any = {};

  if (searchParams.search) {
    whereClause.nomeCompleto = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }
  
  if (searchParams.startDate) {
    whereClause.createdAt = {
      ...whereClause.createdAt,
      gte: new Date(searchParams.startDate),
    };
  }

  if (searchParams.endDate) {
    whereClause.createdAt = {
      ...whereClause.createdAt,
      lte: new Date(new Date(searchParams.endDate).setHours(23, 59, 59, 999)),
    };
  }

  const romaneios = await prisma.romaneio.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    // Incluímos os dados do autor para poder exibir o nome na tabela
    include: {
        author: {
            select: {
                name: true,
            },
        },
    },
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Arquivo Geral de Romaneios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pesquise e gerencie todos os romaneios do sistema.
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
      
      <FilterControls />

      <RomaneiosTable 
        romaneios={romaneios as any} 
        baseUrl={baseUrl} 
      />

    </div>
  );
}
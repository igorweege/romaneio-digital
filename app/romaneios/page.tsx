// app/romaneios/page.tsx - VERSÃO COM FILTROS

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import RomaneiosTable from '@/components/RomaneiosTable';
import FilterControls from '@/components/FilterControls'; // 1. Importamos os filtros

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

  const whereClause: any = {
    authorId: session.user.id,
  };

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
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meus Romaneios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize e gerencie todos os seus romaneios.
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
      
      {/* 2. Adicionamos o formulário de filtro aqui */}
      <FilterControls />

      <RomaneiosTable romaneios={romaneios} baseUrl={baseUrl} />

    </div>
  );
}
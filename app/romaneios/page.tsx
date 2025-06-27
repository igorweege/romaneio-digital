// app/romaneios/page.tsx - VERSÃO CORRETA E VALIDADA

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
    page?: string;
  };
}

export default async function RomaneiosPage({ searchParams }: RomaneiosPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const page = Number(searchParams.page) || 1;
  const pageSize = 25;
  const skip = (page - 1) * pageSize;

  const whereClause: any = {};

  if (searchParams.search) {
    const searchTerms = searchParams.search.trim().split(' ').filter(term => term.length > 0);
    if (searchTerms.length > 0) {
      whereClause.AND = searchTerms.map(term => ({
        nomeCompleto: {
          contains: term,
          mode: 'insensitive',
        },
      }));
    }
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

  const romaneiosFromDb = await prisma.romaneio.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    skip: skip,
    take: pageSize,
    include: {
        author: {
            select: {
                name: true,
            },
        },
    },
  });

  const totalRomaneios = await prisma.romaneio.count({ where: whereClause });
  const totalPages = Math.ceil(totalRomaneios / pageSize);

  // Mapeamento para garantir que os dados são serializáveis
  const romaneios = romaneiosFromDb.map(romaneio => ({
    ...romaneio,
    createdAt: romaneio.createdAt.toISOString(),
    signedAt: romaneio.signedAt ? romaneio.signedAt.toISOString() : null,
    authorName: romaneio.author?.name || 'Desconhecido',
  }));
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Arquivo Geral de Romaneios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pesquise e gerencie todos os romaneios do sistema.
            </p>
          </div>
          <div>
            {/* AQUI A MUDANÇA DE COR DO BOTÃO */}
            <Link
              href="/romaneios/novo"
              className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
            >
              Adicionar Novo Romaneio
            </Link>
          </div>
        </div>
        
        <FilterControls />
  
        <RomaneiosTable 
          romaneios={romaneios as any} 
          baseUrl={baseUrl} 
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
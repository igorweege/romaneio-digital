// app/dashboard/page.tsx - VERSÃO COM BOTÃO AMARELO

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import RomaneiosTable from '@/components/RomaneiosTable';

export default async function Dashboard() {
  // ... (código de busca de dados continua o mesmo)
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const romaneios = await prisma.romaneio.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: { author: { select: { name: true } } },
  });
  
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
          {/* BOTÃO ATUALIZADO PARA A COR DA MARCA */}
          <Link
            href="/romaneios/novo"
            className="rounded-md bg-osirnet-yellow px-4 py-2 text-sm font-semibold text-osirnet-dark-blue shadow-sm hover:bg-opacity-90"
          >
            Adicionar Novo Romaneio
          </Link>
        </div>
      </div>
      
      <RomaneiosTable romaneios={romaneios as any} baseUrl={baseUrl} currentPage={1} totalPages={1} />
    </div>
  );
}
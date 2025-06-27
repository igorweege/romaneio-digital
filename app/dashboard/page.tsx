// app/dashboard/page.tsx - Layout Unificado

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

  const [totalCount, signedCount, pendingCount, recentRomaneios] = await prisma.$transaction([
    prisma.romaneio.count({ where: { authorId: session.user.id } }),
    prisma.romaneio.count({ where: { authorId: session.user.id, isSigned: true } }),
    prisma.romaneio.count({ where: { authorId: session.user.id, isSigned: false } }),
    prisma.romaneio.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { author: { select: { name: true } } },
    })
  ]);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="p-4 sm:p-8">
      {/* Container branco adicionado aqui */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
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
              className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
            >
              Adicionar Novo Romaneio
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Card Total */}
          <div className="overflow-hidden rounded-lg bg-gray-50 border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Total de Romaneios</dt>
                    <dd className="text-3xl font-semibold tracking-tight text-gray-900">{totalCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Card Assinados */}
          <div className="overflow-hidden rounded-lg bg-gray-50 border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Assinados</dt>
                    <dd className="text-3xl font-semibold tracking-tight text-green-600">{signedCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Card Pendentes */}
          <div className="overflow-hidden rounded-lg bg-gray-50 border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Pendentes</dt>
                    <dd className="text-3xl font-semibold tracking-tight text-yellow-600">{pendingCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <RomaneiosTable romaneios={recentRomaneios as any} baseUrl={baseUrl} currentPage={1} totalPages={1} />
      </div>
    </div>
  );
}
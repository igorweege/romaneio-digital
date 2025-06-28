// app/admin/logs/page.tsx - VERSÃO FINAL COM FILTROS

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaginationControls from '@/components/PaginationControls';
import LogFilterControls from '@/components/LogFilterControls';
import { LogAction } from '@prisma/client';

interface LogsPageProps {
  searchParams: {
    page?: string;
    action?: string;
  };
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const page = Number(searchParams.page) || 1;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const whereClause: any = {};

  // Adiciona a lógica de filtro pela ação vinda da URL
  if (searchParams.action && Object.values(LogAction).includes(searchParams.action as LogAction)) {
    whereClause.action = searchParams.action as LogAction;
  }

  const logsFromDb = await prisma.logEntry.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: pageSize,
    include: {
      user: { select: { name: true } },
      romaneio: { select: { nomeCompleto: true } }
    },
  });

  const totalLogs = await prisma.logEntry.count({ where: whereClause });
  const totalPages = Math.ceil(totalLogs / pageSize);
  
  const logs = logsFromDb.map(log => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Logs de Auditoria</h1>
          <p className="mt-1 text-sm text-gray-500">
            Histórico de eventos importantes do sistema.
          </p>
        </div>
        
        <LogFilterControls currentAction={searchParams.action} />

        <div className="flow-root">
            {/* Visualização em Cards para Mobile */}
            <div className="block md:hidden">
              <div className="space-y-3">
                {logs.length > 0 ? logs.map((log) => (
                  <div key={log.id} className="bg-gray-50 p-4 rounded-md border">
                    <p className="font-medium text-gray-800 break-words">{log.message}</p>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p>
                        <strong>Ação:</strong>
                        <span className="ml-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          {log.action}
                        </span>
                      </p>
                      <p>
                        <strong>Usuário:</strong> {log.user?.name || 'Sistema'}
                      </p>
                       {log.romaneio?.nomeCompleto && (
                        <p>
                          <strong>Romaneio:</strong> {log.romaneio.nomeCompleto}
                        </p>
                       )}
                      <p>
                        <strong>Data:</strong> {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )) : (
                   <p className="text-center text-gray-500 py-4">Nenhum log encontrado para os filtros selecionados.</p>
                )}
              </div>
            </div>

            {/* Visualização em Tabela para Desktop */}
            <div className="hidden md:block -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Data / Hora</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo de Ação</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Evento</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Usuário</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Romaneio Associado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {logs.length > 0 ? logs.map((log) => (
                        <tr key={log.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-sm text-gray-800 max-w-sm break-words">{log.message}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.user?.name || 'Sistema'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.romaneio?.nomeCompleto || 'N/A'}</td>
                        </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">Nenhum log encontrado para os filtros selecionados.</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        {totalPages > 1 && (
            <PaginationControls 
            currentPage={page} 
            totalPages={totalPages} 
            />
        )}
      </div>
    </div>
  );
}
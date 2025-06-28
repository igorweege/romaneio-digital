// components/LogFilterControls.tsx - VERSÃO FINAL COM TODOS OS FILTROS

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { LogAction } from '@prisma/client';

// Dicionário de tradução para as ações
const actionLabels: { [key in LogAction]: string } = {
  USER_LOGIN: 'Login de Usuário',
  USER_CREATED: 'Criação de Usuário',
  USER_UPDATED: 'Atualização de Usuário',
  USER_ROLE_CHANGED: 'Mudança de Permissão',
  ROMANEIO_CREATED: 'Criação de Romaneio',
  ROMANEIO_SIGNED: 'Assinatura de Romaneio',
};

export default function LogFilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados para todos os nossos filtros
  const [action, setAction] = useState(searchParams.get('action') || '');
  const [user, setUser] = useState(searchParams.get('user') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (user) params.set('user', user);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleClear = () => {
    router.push(pathname);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border mb-6">
      <form onSubmit={handleFilter} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Ação */}
          <div>
            <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700">
              Filtrar por Ação
            </label>
            <select
              id="action-filter"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-osirnet-dark-blue focus:ring-osirnet-dark-blue sm:text-sm"
            >
              <option value="">Todas as Ações</option>
              {Object.keys(LogAction).map(key => (
                <option key={key} value={key}>
                  {actionLabels[key as LogAction]}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Usuário */}
          <div>
            <label htmlFor="user-search" className="block text-sm font-medium text-gray-700">
              Filtrar por Usuário
            </label>
            <input
              type="text"
              id="user-search"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nome do usuário..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>

          {/* Filtro por Data */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data Inicial</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data Final</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>
        </div>

        <div className="flex justify-end gap-x-3">
          <button type="button" onClick={handleClear} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
            Limpar Filtros
          </button>
          <button type="submit" className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90">
            Filtrar
          </button>
        </div>
      </form>
    </div>
  );
}
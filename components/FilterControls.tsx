// components/FilterControls.tsx - VERSÃO COM FILTRO DE STATUS

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

// O componente agora recebe o status atual como propriedade
interface FilterControlsProps {
    currentStatus?: string;
}

export default function FilterControls({ currentStatus }: FilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleFilter = (e: FormEvent) => {
    e.preventDefault(); 
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    if (startDate) {
      params.set('startDate', startDate);
    } else {
      params.delete('startDate');
    }
    if (endDate) {
      params.set('endDate', endDate);
    } else {
      params.delete('endDate');
    }
    // Ao filtrar, resetamos para a primeira página
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  // --- NOVA FUNÇÃO PARA MUDAR O STATUS ---
  const handleStatusChange = (status: 'ALL' | 'PENDING' | 'SIGNED') => {
      const params = new URLSearchParams(searchParams.toString());
      if (status === 'ALL') {
          params.delete('status');
      } else {
          params.set('status', status);
      }
      // Ao mudar o status, resetamos para a primeira página
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border mb-6">
        {/* --- NOVA SEÇÃO DE BOTÕES DE STATUS --- */}
        <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => handleStatusChange('ALL')}
                    className={`${
                        !currentStatus ? 'border-osirnet-dark-blue text-osirnet-dark-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Todos
                </button>
                <button
                    onClick={() => handleStatusChange('PENDING')}
                    className={`${
                        currentStatus === 'PENDING' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Pendentes
                </button>
                <button
                    onClick={() => handleStatusChange('SIGNED')}
                    className={`${
                        currentStatus === 'SIGNED' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Assinados
                </button>
            </nav>
        </div>
        {/* --- FIM DA SEÇÃO DE STATUS --- */}

      <form onSubmit={handleFilter}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por Nome
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome do solicitante..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-x-3">
          <button
              type="button"
              onClick={handleClear}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
              Limpar Tudo
          </button>
          <button
              type="submit"
              className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
          >
              Filtrar
          </button>
        </div>
      </form>
    </div>
  );
}
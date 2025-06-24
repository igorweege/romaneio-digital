// components/FilterControls.tsx - VERSÃO COM CORREÇÃO DE TYPO

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function FilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  // AQUI A CORREÇÃO:
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleFilter = (e: FormEvent) => {
    e.preventDefault(); 
    const params = new URLSearchParams(searchParams.toString()); // Preserva os filtros existentes
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
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    router.push(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="p-4 bg-gray-50 rounded-lg border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Filtro por Nome */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
          />
        </div>

        {/* Filtro por Data */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-x-3">
        <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
            Limpar Filtros
        </button>
        <button
            type="submit"
            className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
        >
            Filtrar
        </button>
      </div>
    </form>
  );
}
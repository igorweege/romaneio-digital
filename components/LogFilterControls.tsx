// components/LogFilterControls.tsx

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LogAction } from '@prisma/client';

interface LogFilterControlsProps {
  currentAction?: string;
}

export default function LogFilterControls({ currentAction }: LogFilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleActionChange = (action: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (action) {
      params.set('action', action);
    } else {
      params.delete('action');
    }
    params.set('page', '1'); // Resetar para a primeira página ao filtrar
    router.push(`${pathname}?${params.toString()}`);
  };

  // Pega todas as opções do nosso Enum 'LogAction' do Prisma
  const actionOptions = Object.keys(LogAction);

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="max-w-xs">
        <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700">
          Filtrar por tipo de ação
        </label>
        <select
          id="action-filter"
          name="action"
          value={currentAction || ''}
          onChange={(e) => handleActionChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-osirnet-dark-blue focus:ring-osirnet-dark-blue sm:text-sm"
        >
          <option value="">Todas as Ações</option>
          {actionOptions.map(action => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
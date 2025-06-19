// components/EditUserForm.tsx - VERSÃO COMPLETA E ATUALIZADA
'use client';

import { useState } from 'react';
import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          role: role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar o usuário.');
      }

      // Sucesso!
      alert('Usuário atualizado com sucesso!');
      router.push('/admin');
      router.refresh(); // Opcional: Força a atualização dos dados na página admin

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
        <div className="mt-2">
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue" />
        </div>
      </div>

      {/* Campo Email (Apenas Leitura) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
        <div className="mt-2">
          <input type="email" id="email" value={user.email} readOnly disabled className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
        </div>
      </div>

      {/* Campo Role */}
      <div>
          <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Nível de Acesso</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')} className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-osirnet-blue">
            <option value="USER">Usuário Comum</option>
            <option value="ADMIN">Administrador</option>
          </select>
      </div>

      {error && <p className="text-sm text-center font-medium text-red-600 mt-4">{error}</p>}

      <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-4">
        <button type="button" onClick={() => router.push('/admin')} disabled={isLoading} className="text-sm font-semibold leading-6 text-gray-900">Cancelar</button>
        <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400">
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}
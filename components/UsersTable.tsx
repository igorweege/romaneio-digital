// components/UsersTable.tsx - VERSÃO RESPONSIVA

'use client';

import { useState } from 'react';
import type { User as PrismaUser } from '@prisma/client';

// Criamos um tipo que espera a data como string, como fizemos antes
type SerializableUser = Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
  createdAt: string;
};


export default function UsersTable({ initialUsers }: { initialUsers: SerializableUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState('');

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    setError('');
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao excluir usuário');
      }
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setError(err.message);
    }
  };

  return (
    <div className="mt-6 flow-root">
      {error && <p className="text-sm text-center font-medium text-red-600 mb-4">{error}</p>}
      
      {/* Visualização em Cards para Telas Pequenas (Mobile) */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    user.role === 'ADMIN'
                    ? 'bg-blue-100 text-blue-700 ring-blue-700/10'
                    : 'bg-green-100 text-green-700 ring-green-600/20'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Criado em: <span className="font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 justify-end text-sm">
                <a href={`/admin/editar/${user.id}`} className="font-medium text-osirnet-blue hover:underline">
                  Editar
                </a>
                <button onClick={() => handleDelete(user.id)} className="font-medium text-red-600 hover:text-red-800 hover:underline">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualização em Tabela para Telas Médias e Maiores (Desktop) */}
      <div className="hidden md:block -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data de Criação</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{user.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-700/10'
                        : 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a href={`/admin/editar/${user.id}`} className="text-osirnet-blue hover:text-osirnet-dark-blue">
                      Editar
                    </a>
                    <button onClick={() => handleDelete(user.id)} className="ml-4 text-red-600 hover:text-red-800">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
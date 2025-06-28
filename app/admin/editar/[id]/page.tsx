// app/admin/editar/[id]/page.tsx - VERSÃO COM NOTIFICAÇÕES TOAST

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@prisma/client';
import toast from 'react-hot-toast'; // 1. Importamos o toast

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error('Usuário não encontrado.');
        }
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
        setRole(userData.role);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    const dataToUpdate: any = {
      name,
      role,
    };

    if (password) {
      dataToUpdate.password = password;
    }

    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Falha ao atualizar o usuário.');
      }
      
      // 2. Substituímos o alert()
      toast.success('Usuário atualizado com sucesso!');
      router.push('/admin');
      router.refresh();

    } catch (err: any) {
      // 3. Usamos toast.error() para erros
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-center p-8">Carregando...</p>;
  if (!user) return <p className="text-center p-8 text-red-600">Erro ao carregar usuário.</p>

  return (
    <div className="p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuário</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Permissão</label>
            <div className="mt-2">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
             <h2 className="text-lg font-medium text-gray-700">Alterar Senha</h2>
             <p className="text-sm text-gray-500">Deixe em branco para não alterar a senha atual.</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Nova Senha (Opcional)</label>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirmar Nova Senha</label>
            <div className="mt-2">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-4 border-t pt-6">
            <button type="button" onClick={() => router.push('/admin')} disabled={isLoading} className="text-sm font-semibold leading-6 text-gray-900">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400">
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
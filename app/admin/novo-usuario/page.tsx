// app/admin/novo-usuario/page.tsx - VERSÃO COM NOTIFICAÇÕES TOAST

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // 1. Importamos o toast

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se a resposta da API tiver uma mensagem de erro, use-a.
        throw new Error(responseData.error || 'Falha ao criar usuário');
      }

      // 2. Adicionamos a notificação de sucesso
      toast.success(`Usuário '${name}' criado com sucesso!`);
      
      router.push('/admin');
      router.refresh(); // Garante que a lista de usuários será atualizada

    } catch (err: any) {
      // 3. Adicionamos a notificação de erro
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Adicionar Novo Usuário</h1>
            <p className="mt-1 text-sm text-gray-500">Crie uma nova conta e defina seu nível de acesso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
            <div className="mt-2">
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue" />
            </div>
          </div>
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div className="mt-2">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue" />
            </div>
          </div>
          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Senha</label>
            <div className="mt-2">
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue" />
            </div>
          </div>
          {/* Campo Role */}
          <div>
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Nível de Acesso</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')} className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-osirnet-dark-blue">
                <option value="USER">Usuário Comum</option>
                <option value="ADMIN">Administrador</option>
              </select>
          </div>

          <div className="flex items-center justify-end gap-x-4 border-t pt-6">
            <button type="button" onClick={() => router.push('/admin')} className="text-sm font-semibold leading-6 text-gray-900">Cancelar</button>
            <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400">
              {isLoading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// app/admin/novo-usuario/page.tsx
'use client';

import { useState } from 'react';

// Por enquanto, o formulário apenas mostra os dados no console.
// A lógica de salvar no banco virá no próximo passo.
export default function NewUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, password, role });
    // A lógica de verdade para salvar o usuário virá aqui.
  };

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Adicionar Novo Usuário</h1>
        <p className="mt-2 text-sm text-gray-600">Crie uma nova conta e defina seu nível de acesso.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 p-8 bg-white rounded-lg shadow-md border">
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
            <div className="mt-2">
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue" />
            </div>
          </div>
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div className="mt-2">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue" />
            </div>
          </div>
          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Senha</label>
             <div className="mt-2">
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue" />
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-x-4 border-t pt-6">
            <a href="/admin" className="text-sm font-semibold leading-6 text-gray-900">Cancelar</a>
            <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue disabled:bg-blue-300">
              {isLoading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
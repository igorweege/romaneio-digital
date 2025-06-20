// components/NovoRomaneioForm.tsx - VERSÃO COM REDIRECIONAMENTO CORRIGIDO

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoRomaneioForm() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailSolicitante, setEmailSolicitante] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!nomeCompleto) {
      setError('O campo Nome Completo é obrigatório.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/romaneios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto,
          cpf,
          emailSolicitante,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar o romaneio.');
      }

      alert('Romaneio criado com sucesso!');
      
      // AQUI A CORREÇÃO: Redireciona para o dashboard
      router.push('/dashboard'); 
      router.refresh(); // Força a atualização dos dados no dashboard

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nome Completo */}
      <div>
        <label htmlFor="nomeCompleto" className="block text-sm font-medium leading-6 text-gray-900">
          Nome Completo do Solicitante
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="nomeCompleto"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
          />
        </div>
      </div>

      {/* Campo CPF (Opcional) */}
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-gray-900">
          CPF (Opcional)
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
          />
        </div>
      </div>
      
      {/* Campo Email (Opcional) */}
      <div>
        <label htmlFor="emailSolicitante" className="block text-sm font-medium leading-6 text-gray-900">
          Email para envio (Opcional)
        </label>
        <div className="mt-2">
          <input
            type="email"
            id="emailSolicitante"
            value={emailSolicitante}
            onChange={(e) => setEmailSolicitante(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-4">
        <button type="button" onClick={() => router.push('/dashboard')} disabled={isLoading} className="text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400">
          {isLoading ? 'Salvando...' : 'Salvar Romaneio'}
        </button>
      </div>
    </form>
  );
}
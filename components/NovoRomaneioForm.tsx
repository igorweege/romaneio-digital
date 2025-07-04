// components/NovoRomaneioForm.tsx - VERSÃO COMPLETA E CORRIGIDA COM TOAST

'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NovoRomaneioForm() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailSolicitante, setEmailSolicitante] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file || !nomeCompleto) {
      toast.error('O arquivo PDF e o Nome Completo são obrigatórios.');
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nomeCompleto', nomeCompleto);
    formData.append('cpf', cpf);
    formData.append('emailSolicitante', emailSolicitante);

    try {
      const response = await fetch('/api/romaneios', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar o romaneio.');
      }

      toast.success('Romaneio criado com sucesso!');
      
      router.push('/dashboard'); 
      router.refresh();

    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo para Upload do Arquivo */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
          Arquivo PDF do Romaneio
        </label>
        <div className="mt-2">
           <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="relative block w-full min-w-0 flex-auto rounded-md border border-solid border-gray-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-gray-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-gray-100 file:px-3 file:py-[0.32rem] file:text-gray-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-gray-200 focus:border-primary focus:text-gray-700 focus:shadow-te-primary focus:outline-none"
          />
        </div>
      </div>

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

      <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-4">
        <button type="button" onClick={() => router.push('/dashboard')} disabled={isLoading} className="text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400">
          {isLoading ? 'Salvando...' : 'Salvar Romaneio'}
        </button>
      </div>
    </form>
  );
}
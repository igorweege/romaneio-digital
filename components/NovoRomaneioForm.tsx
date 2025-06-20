// components/NovoRomaneioForm.tsx - VERSÃO COM CAMPO DE UPLOAD

'use client';

import { useState, ChangeEvent } from 'react'; // Adicionado ChangeEvent
import { useRouter } from 'next/navigation';

export default function NovoRomaneioForm() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailSolicitante, setEmailSolicitante] = useState('');
  const [file, setFile] = useState<File | null>(null); // State para o arquivo

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com a seleção do arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!nomeCompleto) {
      setError('O campo Nome Completo é obrigatório.');
      setIsLoading(false);
      return;
    }

    // POR ENQUANTO, ESTA FUNÇÃO NÃO FARÁ O UPLOAD.
    // VAMOS ADICIONAR ESSA LÓGICA NO PRÓXIMO PASSO.
    alert('Interface com campo de arquivo pronta! A lógica de upload virá a seguir.');
    setIsLoading(false);
    
    // Comentando a lógica antiga temporariamente
    /*
    try {
      // ... lógica de fetch que vamos reativar e modificar depois
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo para Upload do Arquivo */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium leading-6 text-gray-900">
          Arquivo PDF do Romaneio
        </label>
        <div className="mt-2 flex items-center gap-x-3">
           <input
            id="file"
            name="file"
            type="file"
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

      {/* Campos Opcionais... */}
      {/* (O resto do formulário continua igual) */}
      
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
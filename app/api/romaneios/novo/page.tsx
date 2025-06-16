// app/romaneios/novo/page.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function UploadRomaneioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type !== 'application/pdf') {
        setError('Por favor, selecione um arquivo PDF.');
        setFile(null);
        return;
      }
      setError('');
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo PDF.');
      return;
    }
    // Por enquanto, apenas um alerta para confirmar que a interface funciona.
    alert(`Interface funcionando! Arquivo selecionado: ${file.name}. A lógica de upload virá no próximo passo.`);
  };

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-osirnet-blue">Enviar Novo Romaneio</h1>
        <p className="mt-2 text-sm text-gray-600">Selecione o arquivo PDF para iniciar o processo de assinatura.</p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 p-8 bg-white rounded-lg shadow-md border">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium leading-6 text-gray-900">
              Arquivo PDF
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12A2.25 2.25 0 0120.25 20.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-osirnet-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-osirnet-light-blue focus-within:ring-offset-2 hover:text-osirnet-light-blue"
                  >
                    <span>Selecione um arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">Apenas PDF de até 10MB</p>
                {file && <p className="text-sm font-semibold text-green-700 mt-4">Arquivo selecionado: {file.name}</p>}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center font-medium mt-2">{error}</p>}

          <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-8">
            <a href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900">Cancelar</a>
            <button type="submit" disabled={!file} className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue disabled:bg-gray-400 disabled:cursor-not-allowed">
              Enviar para Assinatura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
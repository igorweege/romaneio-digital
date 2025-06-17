// components/SignatureForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // 1. Importar o router
import type { Romaneio } from '@prisma/client';
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureForm({ romaneio }: { romaneio: Romaneio }) {
  const [signerName, setSignerName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 2. Adicionar estado de carregamento
  const sigCanvas = useRef<SignatureCanvas>(null);
  const router = useRouter(); // 3. Inicializar o router

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  // --- ESTA É A FUNÇÃO QUE VAMOS ATUALIZAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName) {
      alert('Por favor, digite seu nome completo.');
      return;
    }
    if (sigCanvas.current?.isEmpty()) {
      alert('Por favor, forneça sua assinatura no campo abaixo.');
      return;
    }

    setIsLoading(true);

    try {
      const signatureImage = sigCanvas.current?.toDataURL('image/png');

      const response = await fetch('/api/romaneios/assinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          romaneioId: romaneio.id,
          signerName,
          signatureImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar assinatura.');
      }

      // Sucesso! Mostra uma mensagem e redireciona.
      alert('Documento assinado com sucesso! Você será redirecionado.');
      router.push('/sucesso'); // Redireciona para uma página de sucesso

    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // ----------------------------------------------

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-osirnet-blue">
          Assinatura de Documento
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Você está assinando o documento: <strong>{romaneio.fileName}</strong>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 p-8 bg-white rounded-lg shadow-md border"
        >
          <div>
            <label
              htmlFor="signerName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Seu Nome Completo
            </label>
            <input
              type="text"
              id="signerName"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Desenhe sua Assinatura no Quadro Abaixo
            </label>
            <div className="mt-2 w-full h-48 border border-gray-300 rounded-md bg-gray-50">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: 'w-full h-full rounded-md' }}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="text-sm font-semibold text-gray-600 hover:text-osirnet-blue mt-2"
              disabled={isLoading}
            >
              Limpar
            </button>
          </div>
          <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-blue-300"
            >
              {isLoading ? 'Salvando...' : 'Assinar e Salvar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
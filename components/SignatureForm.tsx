// components/SignatureForm.tsx - VERSÃO FINAL E FUNCIONAL

'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useRouter } from 'next/navigation'; // Importamos o router para o redirect

export default function SignatureForm({ romaneioId }: { romaneioId: string }) {
  const router = useRouter(); // Inicializamos o router
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const sigPad = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigPad.current?.clear();
  };

  const handleSave = async () => {
    if (sigPad.current?.isEmpty()) {
      alert("Por favor, forneça uma assinatura.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const signatureImage = sigPad.current?.toDataURL('image/png');

      // 1. Enviamos os dados para a nossa nova API
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          romaneioId,
          signatureImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar a assinatura.');
      }

      // 2. Em caso de sucesso, redireciona para a página de sucesso
      router.push('/sucesso');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <h2 className="text-xl font-semibold text-gray-800">Sua Assinatura</h2>
      <p className="text-sm text-gray-500 mb-4">
        Desenhe sua assinatura no campo abaixo.
      </p>
      <div className="border bg-white rounded-md">
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          canvasProps={{
            className: 'w-full h-48' 
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

      <div className="mt-4 flex justify-end gap-x-4">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold leading-6 text-gray-900"
          disabled={isLoading}
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400"
        >
          {isLoading ? 'Salvando...' : 'Assinar e Salvar'}
        </button>
      </div>
    </div>
  );
}
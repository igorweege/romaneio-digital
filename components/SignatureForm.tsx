// components/SignatureForm.tsx - VERSÃO COMPLETA E CORRIGIDA

'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SignatureFormProps {
  romaneioId: string;
}

export default function SignatureForm({ romaneioId }: SignatureFormProps) {
  const sigPad = useRef<SignatureCanvas>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClear = () => {
    sigPad.current?.clear();
  };

  const handleSave = async () => {
    if (sigPad.current?.isEmpty()) {
      toast.error("Por favor, forneça uma assinatura.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const signatureImage = sigPad.current?.toDataURL('image/png');

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

      toast.success('Documento assinado com sucesso!');
      router.push('/sucesso');

    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // O CONTEÚDO VISUAL RESTAURADO AQUI
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
          className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400"
        >
          {isLoading ? 'Salvando...' : 'Assinar e Salvar'}
        </button>
      </div>
    </div>
  );
}
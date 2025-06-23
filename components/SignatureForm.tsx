// components/SignatureForm.tsx

'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// Este componente recebe o ID do romaneio para sabermos qual atualizar no futuro
export default function SignatureForm({ romaneioId }: { romaneioId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const sigPad = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigPad.current?.clear();
  };

  const handleSave = () => {
    if (sigPad.current?.isEmpty()) {
      alert("Por favor, forneça uma assinatura.");
      return;
    }

    setIsLoading(true);
    // Pega a assinatura como uma imagem no formato PNG (codificada em base64)
    const signatureImage = sigPad.current?.toDataURL('image/png');
    
    // NO PRÓXIMO PASSO, ENVIAREMOS ESTA IMAGEM PARA UMA NOVA API
    console.log("ID do Romaneio:", romaneioId);
    console.log("Imagem da Assinatura (Data URL):", signatureImage);
    alert("Assinatura capturada! O próximo passo é salvá-la.");
    setIsLoading(false);
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
      <div className="mt-4 flex justify-end gap-x-4">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold leading-6 text-gray-900"
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
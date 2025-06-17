// components/SignatureForm.tsx
'use client';

import { useState, useRef } from 'react';
import type { Romaneio } from '@prisma/client';
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureForm({ romaneio }: { romaneio: Romaneio }) {
  const [signerName, setSignerName] = useState('');
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName) {
        alert('Por favor, digite seu nome completo.');
        return;
    }
    if (sigCanvas.current?.isEmpty()) {
      alert('Por favor, forneça sua assinatura no campo abaixo.');
      return;
    }

    // A lógica para salvar a assinatura virá no próximo passo
    const signatureImage = sigCanvas.current?.toDataURL('image/png');
    console.log("Nome:", signerName);
    console.log("Assinatura (imagem em base64):", signatureImage);
    alert('Interface de assinatura funcionando! A lógica para salvar virá no próximo passo.');
  };

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-osirnet-blue">Assinatura de Documento</h1>
            <p className="mt-2 text-sm text-gray-600">
                Você está assinando o documento: <strong>{romaneio.fileName}</strong>
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 p-8 bg-white rounded-lg shadow-md border">
                <div>
                    <label htmlFor="signerName" className="block text-sm font-medium leading-6 text-gray-900">Seu Nome Completo</label>
                    <input type="text" id="signerName" value={signerName} onChange={(e) => setSignerName(e.target.value)} required className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue" />
                </div>
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">Desenhe sua Assinatura no Quadro Abaixo</label>
                    <div className="mt-2 w-full h-48 border border-gray-300 rounded-md bg-gray-50">
                        <SignatureCanvas 
                            ref={sigCanvas}
                            penColor='black'
                            canvasProps={{className: 'w-full h-full rounded-md'}} 
                        />
                    </div>
                    <button type="button" onClick={clearSignature} className="text-sm font-semibold text-gray-600 hover:text-osirnet-blue mt-2">Limpar</button>
                </div>
                <div className="flex items-center justify-end gap-x-4 border-t pt-6 mt-8">
                    <button type="submit" className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90">
                      Assinar e Salvar Documento
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
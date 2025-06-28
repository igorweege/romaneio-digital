// components/SignatureForm.tsx - VERSÃO COM TOAST

'use client';

import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // 1. Importamos o toast

interface SignatureFormProps {
  romaneioId: string;
}

export default function SignatureForm({ romaneioId }: SignatureFormProps) {
  const sigCanvas = useRef<SignaturePad>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error('Por favor, forneça sua assinatura.');
      return;
    }

    setIsLoading(true);
    const signatureImage = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

    try {
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
        throw new Error(errorData.error || 'Falha ao salvar assinatura.');
      }
      
      // 2. Usamos toast.success()
      toast.success('Documento assinado com sucesso!');

      router.push('/sucesso');

    } catch (err: any) {
      // 3. Usamos toast.error()
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
        {/* ... (o resto do formulário continua o mesmo) ... */}
    </div>
  );
}
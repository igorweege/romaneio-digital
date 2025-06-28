// components/NovoRomaneioForm.tsx - VERSÃO COM TOAST

'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // 1. Importamos o toast

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file || !nomeCompleto) {
      toast.error('Por favor, preencha o Nome Completo e selecione um arquivo PDF.');
      setIsLoading(false);
      return;
    }

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

      // 2. Substituímos o alert() por toast.success()
      toast.success('Romaneio criado com sucesso!');
      
      router.push('/dashboard');
      router.refresh();

    } catch (err: any) {
      // 3. Usamos toast.error() para erros
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... (o resto do formulário continua o mesmo) ... */}
    </form>
  );
}
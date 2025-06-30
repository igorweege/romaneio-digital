// components/SendEmailButton.tsx - VERSÃO COM TEXTO AJUSTADO

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';

export default function SendEmailButton({ romaneioId, defaultEmail }: { romaneioId: string; defaultEmail?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Por favor, insira um endereço de email.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Enviando email...');

    try {
      const response = await fetch('/api/email/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ romaneioId, email }),
      });

      const data = await response.json();
      toast.dismiss(toastId);

      if (!response.ok) throw new Error(data.error || 'Falha ao enviar email.');
      
      toast.success('Email enviado com sucesso!');
      setIsOpen(false);

    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-4 text-sm font-medium text-osirnet-dark-blue hover:text-osirnet-blue hover:underline"
      >
        Enviar por Email
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Enviar Link de Assinatura">
        <div className="p-2 flex flex-col space-y-4">
          {/* TEXTO AJUSTADO AQUI */}
          <p className="text-sm text-gray-600">
            Insira o email do destinatário.
          </p>
          
          <div>
            <label htmlFor="send-email-input" className="sr-only">Email</label>
            <input
              id="send-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
            />
          </div>

          <div className="pt-2 flex justify-end gap-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-gray-900"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isLoading}
              className="rounded-md bg-osirnet-dark-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 disabled:bg-gray-400"
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
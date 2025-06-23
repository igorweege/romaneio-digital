// components/Modal.tsx

'use client';

import React from 'react';

// A interface define as "propriedades" que o Modal aceita
interface ModalProps {
  isOpen: boolean; // Controla se o modal está aberto ou fechado
  onClose: () => void; // Função para ser executada quando o modal for fechado
  children: React.ReactNode; // O conteúdo que vai dentro do modal
  title: string; // Um título para o modal
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // Se não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Fundo escurecido (overlay)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Caixa do Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            {/* Ícone de "X" para fechar */}
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
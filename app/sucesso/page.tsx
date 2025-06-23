// app/sucesso/page.tsx

import Link from 'next/link';

export default function SucessoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <svg className="w-16 h-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="mt-4 text-3xl font-bold text-gray-800">Assinado com Sucesso!</h1>
      <p className="mt-2 text-gray-600">
        Obrigado. O documento foi assinado e o registro foi atualizado.
      </p>
      <Link href="/" className="mt-8 rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90">
        Voltar à Página Inicial
      </Link>
    </div>
  );
}
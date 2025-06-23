// app/assinar/[token]/page.tsx - VERSÃO COM NOVO VISUALIZADOR

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SignatureForm from '@/components/SignatureForm';
import PdfViewer from '@/components/PdfViewer'; // Importamos nosso novo componente

interface SignaturePageProps {
  params: {
    token: string;
  };
}

export default async function SignaturePage({ params }: SignaturePageProps) {
  const { token } = params;

  if (!token) {
    notFound();
  }

  const romaneio = await prisma.romaneio.findUnique({
    where: {
      signatureToken: token,
    },
  });

  if (!romaneio) {
    notFound();
  }

  if (romaneio.isSigned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Documento Já Assinado</h1>
          <p className="mt-2 text-gray-700">
            Este romaneio para <strong>{romaneio.nomeCompleto}</strong> já foi assinado em {new Date(romaneio.signedAt!).toLocaleDateString('pt-BR')}.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Assinatura de Romaneio</h1>
          <p className="mt-2 text-sm text-gray-600">
            Documento referente a: <strong>{romaneio.nomeCompleto}</strong>
          </p>
          
          {/* Visualizador de PDF */}
          <div className="mt-6">
            {romaneio.fileUrl ? (
              // TROCAMOS o <iframe> pelo nosso novo componente
              <PdfViewer fileUrl={romaneio.fileUrl} />
            ) : (
              <p className="p-4 text-center text-red-600">Arquivo PDF não encontrado.</p>
            )}
          </div>

          <SignatureForm romaneioId={romaneio.id} />
        </div>
      </div>
    </div>
  );
}
// app/assinar/[token]/page.tsx
import prisma from '@/lib/prisma';
import SignatureForm from '@/components/SignatureForm'; // Vamos criar este componente a seguir

interface SignaturePageProps {
  params: {
    token: string;
  };
}

export default async function SignaturePage({ params }: SignaturePageProps) {
  const { token } = params;

  // Busca o romaneio no banco usando o token da URL
  const romaneio = await prisma.romaneio.findUnique({
    where: {
      signatureToken: token,
      isSigned: false, // Só permite assinar se ainda não foi assinado
    },
  });

  // Se o romaneio não for encontrado ou já foi assinado, mostra uma mensagem de erro.
  if (!romaneio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Link Inválido ou Expirado</h1>
          <p className="mt-2 text-gray-600">Este link de assinatura não é válido ou o documento já foi assinado.</p>
        </div>
      </div>
    );
  }

  // Se encontrou, renderiza o formulário de assinatura, passando os dados do romaneio
  return <SignatureForm romaneio={romaneio} />;
}
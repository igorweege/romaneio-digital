// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';
import prisma from '@/lib/prisma'; // 1. Importar o prisma

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // 2. Buscar os romaneios do usuário logado no banco de dados
  const romaneios = await prisma.romaneio.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-bold text-osirnet-blue">Dashboard de Romaneios</h1>
                <p className="mt-1 text-lg text-gray-600">Olá, {session.user?.name}!</p>
            </div>
            <SignOutButton />
        </div>
        
        {/* -- Botão de Ação Principal -- */}
        <div className="mb-8">
            <a href="/romaneios/novo" className="rounded-md bg-osirnet-blue px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-osirnet-blue">
              + Enviar Novo Romaneio
            </a>
            {session.user.role === 'ADMIN' && (
                <a href="/admin" className="ml-4 text-sm font-semibold text-gray-600 hover:text-osirnet-blue">
                Acessar Painel Administrativo
                </a>
            )}
        </div>

        {/* -- Tabela de Romaneios -- */}
        <div className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Seus Romaneios Enviados</h2>
            <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome do Arquivo</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data de Envio</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Links</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {romaneios.map((romaneio) => (
                        <tr key={romaneio.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{romaneio.fileName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(romaneio.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                romaneio.isSigned
                                ? 'bg-green-100 text-green-700 ring-green-600/20'
                                : 'bg-yellow-100 text-yellow-800 ring-yellow-600/20'
                            }`}>
                            {romaneio.isSigned ? 'Assinado' : 'Aguardando Assinatura'}
                            </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-osirnet-light-blue space-x-4">
                            <a href={`/assinar/${romaneio.signatureToken}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">Link de Assinatura</a>
                            {romaneio.isSigned && romaneio.signedUrl && (
                                <a href={romaneio.signedUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">Ver PDF Assinado</a>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>

      </div>
    </div>
  );
}
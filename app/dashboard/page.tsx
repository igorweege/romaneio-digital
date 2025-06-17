// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const romaneios = await prisma.romaneio.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* CABEÇALHO PADRÃO */}
      <header className="bg-osirnet-blue shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Romaneio Digital</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-300">Olá, {session.user.name}</span>
               <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seu Dashboard</h1>
                    <p className="mt-1 text-gray-600">Visualize e gerencie seus romaneios.</p>
                </div>
                <div>
                    <Link href="/romaneios/novo" className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
                        + Enviar Novo Romaneio
                    </Link>
                </div>
            </div>
            
            {session.user.role === 'ADMIN' && (
                <div className="mb-4">
                <Link href="/admin" className="text-sm font-semibold text-osirnet-light-blue hover:underline">
                    Acessar Painel Administrativo &rarr;
                </Link>
                </div>
            )}

            {/* Tabela de Romaneios */}
            <div className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Seus Romaneios Enviados</h2>
                 <div className="flow-root">
                    {/* ... O restante do código da tabela continua aqui ... */}
                    <table className="min-w-full divide-y divide-gray-300">
                      {/* ... thead ... */}
                      <thead>
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome do Arquivo</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data de Envio</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Links</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {romaneios.length > 0 ? romaneios.map((romaneio) => (
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
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">Você ainda não enviou nenhum romaneio.</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                 </div>
            </div>
        </div>
      </main>
    </div>
  );
}
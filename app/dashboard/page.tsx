// app/dashboard/page.tsx - VERSÃO FINAL COM STATUS

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import CopyLinkButton from '@/components/CopyLinkButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const romaneios = await prisma.romaneio.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo de volta, {session.user.name}!
          </p>
        </div>
        <div>
          <Link
            href="/romaneios/novo"
            className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
          >
            Adicionar Novo Romaneio
          </Link>
        </div>
      </div>

      <div className="mt-6 flow-root">
        <h2 className="text-xl font-semibold text-gray-700">Romaneios Recentes</h2>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Nome do Solicitante
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data de Criação
                  </th>
                  {/* NOVA COLUNA DE STATUS */}
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {romaneios.length > 0 ? (
                  romaneios.map((romaneio) => (
                    <tr key={romaneio.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {romaneio.nomeCompleto}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(romaneio.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      {/* CÉLULA DE STATUS COM LÓGICA CONDICIONAL */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {romaneio.isSigned ? (
                          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Assinado
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {romaneio.fileUrl && (
                          <a
                            href={romaneio.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-osirnet-light-blue hover:text-osirnet-blue hover:underline"
                          >
                            Visualizar PDF
                          </a>
                        )}
                        {/* AÇÕES INTELIGENTES: SÓ MOSTRA O BOTÃO SE NÃO FOI ASSINADO */}
                        {!romaneio.isSigned ? (
                          <CopyLinkButton 
                            link={`${baseUrl}/assinar/${romaneio.signatureToken}`}
                          />
                        ) : (
                          <span className="ml-4 text-xs text-gray-500">
                            em {new Date(romaneio.signedAt!).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                      Nenhum romaneio encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/romaneios/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function RomaneiosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Por enquanto, busca todos os romaneios do usuário logado
  const romaneios = await prisma.romaneio.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meus Romaneios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize e gerencie todos os seus romaneios.
          </p>
        </div>
        <div>
          <Link
            href="/romaneios/novo" // Link já corrigido para o novo caminho
            className="rounded-md bg-osirnet-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
          >
            Adicionar Novo Romaneio
          </Link>
        </div>
      </div>

      <div className="mt-6 flow-root">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-sm text-gray-500">
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
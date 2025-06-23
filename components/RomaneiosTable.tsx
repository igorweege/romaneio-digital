// components/RomaneiosTable.tsx - VERSÃO COM CORREÇÃO FINAL DE TIPAGEM

'use client';

import { useState } from 'react';
import { Prisma } from '@prisma/client'; // Importamos o Prisma para usar seus tipos
import CopyLinkButton from '@/components/CopyLinkButton';
import Modal from '@/components/Modal';
import QRCode from 'qrcode.react';

// AQUI A CORREÇÃO: Usamos o Prisma para gerar um tipo perfeito e automático
const romaneioWithAuthor = Prisma.validator<Prisma.RomaneioDefaultArgs>()({
  include: { author: { select: { name: true } } },
});
type RomaneioWithAuthor = Prisma.RomaneioGetPayload<typeof romaneioWithAuthor>;


interface RomaneiosTableProps {
  romaneios: RomaneioWithAuthor[];
  baseUrl: string;
}

export default function RomaneiosTable({ romaneios, baseUrl }: RomaneiosTableProps) {
  const [selectedRomaneio, setSelectedRomaneio] = useState<RomaneioWithAuthor | null>(null);

  const getSignatureLink = (token: string) => `${baseUrl}/assinar/${token}`;

  return (
    <>
      <Modal 
        isOpen={!!selectedRomaneio} 
        onClose={() => setSelectedRomaneio(null)}
        title="QR Code para Assinatura"
      >
        {selectedRomaneio && (
          <div className="flex flex-col items-center justify-center p-4">
            <QRCode 
              value={getSignatureLink(selectedRomaneio.signatureToken)}
              size={256}
              level="H"
              includeMargin={true}
            />
            <p className="mt-4 text-sm text-gray-600 break-all">
              Aponte a câmera para o código ou use o link abaixo.
            </p>
            <p className="mt-2 text-xs text-gray-500 font-mono break-all">
              {getSignatureLink(selectedRomaneio.signatureToken)}
            </p>
          </div>
        )}
      </Modal>

      <div className="mt-6 flow-root">
        <h2 className="text-xl font-semibold text-gray-700">Listagem de Romaneios</h2>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Nome do Solicitante
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Criado por
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data de Criação
                  </th>
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
                        {romaneio.author?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(romaneio.createdAt).toLocaleDateString('pt-BR')}
                      </td>
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
                          <a href={romaneio.fileUrl} target="_blank" rel="noopener noreferrer" className="text-osirnet-light-blue hover:text-osirnet-blue hover:underline">
                            Visualizar PDF
                          </a>
                        )}
                        {!romaneio.isSigned && romaneio.signatureToken && (
                          <>
                            <CopyLinkButton link={getSignatureLink(romaneio.signatureToken)} />
                            <button onClick={() => setSelectedRomaneio(romaneio)} className="ml-4 text-sm font-medium text-osirnet-light-blue hover:text-osirnet-blue hover:underline">
                              QR Code
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                      Nenhum romaneio encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
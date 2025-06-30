// components/RomaneiosTable.tsx - VERSÃO DEFINITIVA E COMPLETA

'use client';

import { useState } from 'react';
import type { Romaneio } from '@prisma/client';
import CopyLinkButton from '@/components/CopyLinkButton';
import Modal from '@/components/Modal';
import QRCode from 'qrcode.react';
import PaginationControls from '@/components/PaginationControls';
import SendEmailButton from '@/components/SendEmailButton'; // Caminho corrigido

type RomaneioWithAuthor = Romaneio & {
  author: { name: string | null } | null;
};

interface RomaneiosTableProps {
  romaneios: RomaneioWithAuthor[];
  baseUrl: string;
  currentPage: number;
  totalPages: number;
}

export default function RomaneiosTable({ romaneios, baseUrl, currentPage, totalPages }: RomaneiosTableProps) {
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
        
        {/* Visualização em Cards para Telas Pequenas (Mobile) */}
        <div className="block md:hidden">
          <div className="space-y-4 mt-4">
            {romaneios.length > 0 ? (
              romaneios.map((romaneio) => (
                <div key={romaneio.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 break-words">{romaneio.nomeCompleto}</span>
                    {romaneio.isSigned ? (
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Assinado</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Pendente</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Criado por: <span className="font-medium text-gray-700">{romaneio.author?.name || 'N/A'}</span></p>
                    <p>Data: <span className="font-medium text-gray-700">{new Date(romaneio.createdAt).toLocaleDateString('pt-BR')}</span></p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-x-4 gap-y-2 items-center justify-end text-sm">
                    {romaneio.fileUrl && <a href={romaneio.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-osirnet-light-blue hover:text-osirnet-blue">Visualizar PDF</a>}
                    {!romaneio.isSigned && romaneio.emailSolicitante && <SendEmailButton romaneioId={romaneio.id} />}
                    {!romaneio.isSigned && <CopyLinkButton link={getSignatureLink(romaneio.signatureToken)} />}
                    {!romaneio.isSigned && <button onClick={() => setSelectedRomaneio(romaneio)} className="font-medium text-osirnet-light-blue hover:text-osirnet-blue">QR Code</button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">Nenhum romaneio encontrado.</div>
            )}
          </div>
        </div>

        {/* Visualização em Tabela para Telas Médias e Maiores (Desktop) */}
        <div className="hidden md:table w-full -mx-4 sm:-mx-6 lg:-mx-8 mt-4">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome do Solicitante</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Criado por</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data de Criação</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {romaneios.length > 0 ? (
                  romaneios.map((romaneio) => (
                    <tr key={romaneio.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{romaneio.nomeCompleto}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{romaneio.author?.name || 'N/A'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(romaneio.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {romaneio.isSigned ? (
                          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Assinado</span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Pendente</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-4">
                        {romaneio.fileUrl && (
                          <>
                            <a href={romaneio.fileUrl} target="_blank" rel="noopener noreferrer" className="text-osirnet-light-blue hover:text-osirnet-blue hover:underline">Visualizar</a>
                            <a href={`${romaneio.fileUrl}-/content-disposition/attachment/`} target="_blank" rel="noopener noreferrer" className="text-osirnet-light-blue hover:text-osirnet-blue hover:underline">Baixar</a>
                          </>
                        )}
                        {!romaneio.isSigned && (
                          <>
                            {romaneio.emailSolicitante && <SendEmailButton romaneioId={romaneio.id} />}
                            <CopyLinkButton link={getSignatureLink(romaneio.signatureToken)} />
                            <button onClick={() => setSelectedRomaneio(romaneio)} className="text-sm font-medium text-osirnet-light-blue hover:text-osirnet-blue hover:underline">QR Code</button>
                          </>
                        )}
                         {romaneio.isSigned && romaneio.signedAt && (
                           <span className="text-xs text-gray-500">
                             em {new Date(romaneio.signedAt).toLocaleDateString('pt-BR')}
                           </span>
                         )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-sm text-gray-500">Nenhum romaneio encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {totalPages > 1 && ( <PaginationControls currentPage={currentPage} totalPages={totalPages} /> )}
    </>
  );
}
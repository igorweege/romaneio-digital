// components/PdfViewer.tsx - VERSÃO FINAL USANDO CDN

'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// AQUI A MUDANÇA: Apontamos para uma CDN pública e confiável
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-md w-full overflow-y-auto max-h-[75vh]">
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-4 text-center">Carregando PDF...</div>}
          error={<div className="p-4 text-center text-red-600">Falha ao carregar o PDF. Por favor, tente baixar o arquivo.</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={800}
            />
          ))}
        </Document>
      </div>
      {numPages && (
        <p className="mt-2 text-sm text-gray-600">
          Total de {numPages} página(s)
        </p>
      )}
    </div>
  );
}
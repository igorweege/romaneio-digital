// components/PdfViewer.tsx

'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuração ESSENCIAL para o pdf.js funcionar com o Next.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

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
          error={<div className="p-4 text-center text-red-600">Falha ao carregar o PDF.</div>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={800} // Você pode ajustar a largura aqui
            />
          ))}
        </Document>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Página {pageNumber} de {numPages}
      </p>
    </div>
  );
}
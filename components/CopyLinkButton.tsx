// components/CopyLinkButton.tsx

'use client';

import { useState } from 'react';

export default function CopyLinkButton({ link }: { link: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Volta ao normal depois de 2 segundos
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      className={`ml-4 text-sm font-medium transition-colors ${
        isCopied
          ? 'text-green-600'
          : 'text-osirnet-light-blue hover:text-osirnet-blue hover:underline'
      }`}
    >
      {isCopied ? 'Copiado!' : 'Copiar Link'}
    </button>
  );
}
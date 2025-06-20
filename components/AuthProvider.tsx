// components/AuthProvider.tsx - VERSÃO ATUALIZADA

'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// A interface agora descreve que o componente pode receber a 'session'
interface AuthProviderProps {
  children: React.ReactNode;
  session?: any; // O '?' torna a propriedade opcional
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  // Passamos a sessão recebida para o SessionProvider
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
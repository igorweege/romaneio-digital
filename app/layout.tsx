// app/layout.tsx - VERSÃO ATUALIZADA

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header"; // Importamos nosso novo Header

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Romaneio Digital",
  description: "Gerenciamento de romaneios digitais",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pegamos a sessão no servidor para decidir se mostramos o Header
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {/* Se houver sessão (usuário logado), mostra o Header */}
          {session && <Header />}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
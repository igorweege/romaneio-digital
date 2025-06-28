// app/layout.tsx - VERSÃO COM TOASTER

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import { Toaster } from 'react-hot-toast'; // 1. Importamos o Toaster

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
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider session={session}>
          {/* 2. Adicionamos o componente Toaster aqui */}
          <Toaster position="top-right" reverseOrder={false} />
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
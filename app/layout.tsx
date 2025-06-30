// app/layout.tsx - VERSÃO FINAL E SIMPLIFICADA

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";

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
          {/* AQUI A MUDANÇA: Renderizamos o Header incondicionalmente. */}
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
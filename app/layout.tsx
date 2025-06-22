// app/layout.tsx - VERSÃO COM HEADER SEMPRE PRESENTE

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
      <body className={inter.className}>
        <AuthProvider session={session}>
          {/* MUDANÇA AQUI: Renderizamos o Header incondicionalmente.
            O próprio Header já tem a lógica interna para se esconder
            se não houver sessão.
          */}
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
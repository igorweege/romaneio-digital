// components/Header.tsx - VERSÃO DEFINITIVA COM TODOS OS LINKS E CORREÇÕES

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <header className="bg-osirnet-yellow shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center animate-pulse">
            <div className="flex items-center gap-x-8">
              <div className="h-10 w-36 bg-yellow-300 rounded"></div>
              <div className="h-4 w-20 bg-yellow-300 rounded"></div>
              <div className="h-4 w-20 bg-yellow-300 rounded"></div>
            </div>
            <div className="flex items-center gap-x-4">
              <div className="h-4 w-24 bg-yellow-300 rounded"></div>
              <div className="h-9 w-14 bg-red-400 rounded-md"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <header className="bg-osirnet-yellow shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard">
                <Image
                  className="h-10 w-auto"
                  src="/logo-osirnet.png"
                  alt="Logo Osirnet"
                  width={175}
                  height={40}
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'border-osirnet-dark-blue text-osirnet-dark-blue'
                    : 'border-transparent text-gray-700 hover:border-gray-500 hover:text-osirnet-dark-blue'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/romaneios"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith('/romaneios')
                    ? 'border-osirnet-dark-blue text-osirnet-dark-blue'
                    : 'border-transparent text-gray-700 hover:border-gray-500 hover:text-osirnet-dark-blue'
                }`}
              >
                Romaneios
              </Link>
              {user?.role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname === '/admin'
                        ? 'border-osirnet-dark-blue text-osirnet-dark-blue'
                        : 'border-transparent text-gray-700 hover:border-gray-500 hover:text-osirnet-dark-blue'
                    }`}
                  >
                    Usuários
                  </Link>
                  {/* LINK DE LOGS RESTAURADO AQUI */}
                  <Link
                    href="/admin/logs"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname === '/admin/logs'
                        ? 'border-osirnet-dark-blue text-osirnet-dark-blue'
                        : 'border-transparent text-gray-700 hover:border-gray-500 hover:text-osirnet-dark-blue'
                    }`}
                  >
                    Logs
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
             <span className="text-sm text-osirnet-dark-blue mr-4">
                Olá, {user?.name}
             </span>
             <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
             >
                Sair
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
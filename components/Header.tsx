// components/Header.tsx - VERSÃO COM LINK PARA LOGS

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
    return <header className="h-16 bg-white shadow-sm" />;
  }
  
  if (!session) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard">
                <Image
                  className="h-8 w-auto"
                  src="/logo-osirnet.png"
                  alt="Logo Osirnet"
                  width={140}
                  height={32}
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'border-osirnet-blue text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/romaneios"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname.startsWith('/romaneios')
                    ? 'border-osirnet-blue text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
                        ? 'border-osirnet-blue text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Usuários
                  </Link>
                  {/* NOVO LINK DE LOGS */}
                  <Link
                    href="/admin/logs"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname === '/admin/logs'
                        ? 'border-osirnet-blue text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Logs
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
             <span className="text-sm text-gray-600 mr-4">
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
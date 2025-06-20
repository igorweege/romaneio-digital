// components/LoginForm.tsx - VERSÃO COM LOGO

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image'; // 1. IMPORTAMOS O COMPONENTE IMAGE

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setLocalError('Email ou senha inválidos. Tente novamente.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setIsLoading(false);
      setLocalError('Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const getErrorMessage = () => {
    if (localError) return localError;
    if (error === 'CredentialsSignin') {
      return 'Email ou senha inválidos.';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {/* 2. ADICIONAMOS O LOGO AQUI */}
          <Image
            className="mx-auto h-12 w-auto"
            src="/logo.png" // Certifique-se que este é o caminho/nome correto do seu logo na pasta 'public'
            alt="Logo da Empresa"
            width={200} // Ajuste a largura conforme necessário
            height={50}  // Ajuste a altura conforme necessário
          />
          <h1 className="mt-6 text-3xl font-bold text-gray-800">Login</h1>
          <p className="mt-2 text-sm text-gray-600">Acesse sua conta para continuar</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-osirnet-blue focus:border-osirnet-blue"
                placeholder="Senha"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-osirnet-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-osirnet-blue disabled:bg-gray-400"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
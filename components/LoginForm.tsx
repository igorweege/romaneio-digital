// components/LoginForm.tsx - VERSÃO COM TEXTO BRANCO

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

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
    <div>
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-white">
            Acesse sua conta
        </h2>
        <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-md">
                    {errorMessage}
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                        Senha
                    </label>
                    <div className="mt-2">
                        <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-osirnet-dark-blue focus:border-osirnet-dark-blue"
                        />
                    </div>
                </div>

                <div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-osirnet-dark-blue bg-osirnet-yellow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-osirnet-yellow disabled:bg-gray-400"
                    >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
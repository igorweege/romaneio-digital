// app/login/page.tsx - VERSÃO FINAL COM LOGO E CORES
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setIsLoading(false);
    if (result?.ok) {
      router.push('/dashboard');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    // MUDANÇA 1: Fundo da página com um cinza mais suave
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-2xl shadow-xl">
        
        <div className="flex justify-center">
          <Image
            src="/logo-osirnet.png"
            alt="Logo Osirnet"
            width={250}
            height={100}
            priority
          />
        </div>

        {/* MUDANÇA 2: Cor do título */}
        <h2 className="text-2xl font-bold text-center text-osirnet-blue pt-4">
          Acessar Sistema
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            {/* MUDANÇA 3: Cor do foco nos inputs */}
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-osirnet-light-blue focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Senha</label>
            {/* MUDANÇA 3: Cor do foco nos inputs */}
            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-osirnet-light-blue focus:border-transparent"/>
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            {/* MUDANÇA 4: Cor do botão */}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-osirnet-blue border border-transparent rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-osirnet-light-blue disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
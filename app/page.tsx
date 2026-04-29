// LOGIN, MODIFICALE TODO EL ESTILO
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAPI } from '@/services/api';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = await loginAPI(email, password);
      localStorage.setItem('jwt_token', token);
      router.push('/dashboard');

    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f141e]">
      <img
        src="/images/tec.jpg"
        className='absolute z-0 inset-0 w-full h-full object-cover opacity-10 grayscale brightness-50'
      >
      </img>
      <div className="hidden z-2 lg:block lg:w-1/2 bg-[#1a1a1a] relative overflow-hidden rounded-r-full">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <Image
            src="/images/lince.jpg"
            alt="Lince IT Celaya"
            fill // Esto hace que la imagen llene todo el contenedor (el div padre)
            className="object-cover"
            priority // Esto le dice a Next.js: "Esta imagen es la más importante, cárgala de inmediato"
          />
        </div>
      </div>

      <div className="w-full z-2 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col items-center">

          <div className="mb-8 w-24 h-24  rounded-full flex items-center justify-center text-xs text-gray-400">
            <img src="/images/logo-itc.webp"></img>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo!</h1>
          <p className="text-gray-400 mb-8">Plataforma TecNM 5.0 - Inicia sesión</p>

          <form onSubmit={handleLogin} className="w-full space-y-4">

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Correo Institucional"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1c2431] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#c6538c]"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1c2431] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#c6538c]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-8 bg-[#111111] hover:bg-[#222222] text-white font-semibold rounded-3xl border border-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center h-[50px]"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
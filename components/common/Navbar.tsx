'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getPerfilEstudiante } from '@/services/api';
import { Estudiante } from '@/types/api';
import { getBase64ImageSrc } from '@/lib/utils';
import { Spinner } from '@/components/common/Spinner';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<Estudiante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getPerfilEstudiante();
        setUser(data);
      } catch (error) {
        console.error("Error cargando perfil en el Navbar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { name: 'Inicio', path: '/dashboard' },
    { name: 'Calificaciones', path: '/calificaciones' },
    { name: 'Horario', path: '/horario' },
    { name: 'Profesores', path: '/profesores' },
    { name: 'Kardex', path: '/kardex' },
  ];

  return (
    <nav className="relative flex items-center justify-between w-full px-4 lg:px-8 py-4 bg-[#1a1a1a] text-white z-50">
      
      <div className="flex items-center shrink-0">
        <img 
          src="/assets/tecnm-logo.png" 
          alt="TecNM Logo" 
          className="h-10 lg:h-12 w-auto" 
        />
      </div>

      <div className="hidden lg:flex space-x-6 xl:space-x-8 font-medium absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (pathname === '/' && link.path === '/dashboard');
          
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`transition-colors duration-200 whitespace-nowrap ${
                isActive 
                  ? 'text-[#c6538c]' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        
        <div className="flex items-center bg-[#2a2a2a] rounded-full px-2 lg:px-4 py-1.5 lg:min-w-[180px] justify-center lg:justify-end h-11 transition-all">
          {isLoading ? (
            <div className="flex items-center justify-center lg:justify-end w-full lg:pr-2">
               <Spinner className="h-5 w-5 text-[#c6538c]" />
            </div>
          ) : user ? (
            <>
              <span className="hidden lg:block text-sm font-semibold mr-3 truncate max-w-[130px]">
                {user.persona} 
              </span>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-500 bg-gray-700 shrink-0">
                <img 
                  src={getBase64ImageSrc(user.foto)} 
                  alt={`Foto de ${user.persona}`} 
                  className="h-full w-full object-cover"
                />
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Sin sesión</span>
          )}
        </div>

        {!isLoading && user && (
          <button 
            onClick={handleLogout}
            title="Cerrar sesión"
            className="hidden lg:flex items-center justify-center p-2 text-gray-400 hover:text-[#c6538c] hover:bg-[#2a2a2a] rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-colors focus:outline-none"
        >
          {isMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div 
        className={`absolute top-[100%] left-0 w-full bg-[#1a1a1a] border-t border-[#2a2a2a] shadow-xl lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex flex-col space-y-4 px-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (pathname === '/' && link.path === '/dashboard');
            
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`block text-lg font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-[#c6538c]' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {user && (
            <div className="pt-4 mt-2 border-t border-[#2a2a2a] flex justify-between items-center">
              <div className="truncate pr-4">
                <p className="text-sm text-gray-400">Conectado como:</p>
                <p className="font-semibold text-white truncate">{user.persona}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#c6538c] hover:text-white px-3 py-2 rounded-lg hover:bg-[#c6538c] hover:bg-opacity-20 transition-colors shrink-0"
              >
                <span className="font-medium">Salir</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
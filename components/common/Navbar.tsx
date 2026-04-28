'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPerfilEstudiante } from '@/services/api';
import { Estudiante } from '@/types/api';
import { getBase64ImageSrc } from '@/lib/utils';
import { Spinner } from '@/components/common/Spinner';

export default function Navbar() {
  const pathname = usePathname();
  
  const [user, setUser] = useState<Estudiante | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const navLinks = [
    { name: 'Inicio', path: '/dashboard' },
    { name: 'Materias', path: '/materias' },
    { name: 'Horario', path: '/horario' },
  ];

  return (
    <nav className="flex items-center justify-between w-full px-8 py-4 bg-[#1a1a1a] text-white">
      
      <div className="flex items-center">
        <img 
          src="/assets/tecnm-logo.png" 
          alt="TecNM Logo" 
          className="h-12 w-auto" 
        />
      </div>

      <div className="flex space-x-8 font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (pathname === '/' && link.path === '/dashboard');
          
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`transition-colors duration-200 ${
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

      <div className="flex items-center bg-[#2a2a2a] rounded-full px-4 py-1.5 min-w-[200px] justify-end h-11">
        {isLoading ? (
          <div className="flex items-center justify-end w-full pr-2">
             <Spinner className="h-5 w-5 text-[#c6538c]" />
          </div>
        ) : user ? (
          <>
            <span className="text-sm font-semibold mr-3 truncate max-w-[150px]">
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

    </nav>
  );
}
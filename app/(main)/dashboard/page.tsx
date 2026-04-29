'use client';

import React, { useEffect, useState } from 'react';
import { getPerfilEstudiante, getKardex } from '@/services/api';
import { Estudiante, KardexData } from '@/types/api';
import { getBase64ImageSrc } from '@/lib/utils';
import { Spinner } from '@/components/common/Spinner';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function DashboardPage() {
  const [user, setUser] = useState<Estudiante | null>(null);
  const [kardex, setKardex] = useState<KardexData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData] = await Promise.all([
          getPerfilEstudiante()
        ]);
        setUser(userData);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <Spinner className="h-12 w-12 text-[#c6538c]" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-700">

      {/* 1. SECCIÓN PERFIL PRINCIPAL */}
      <section className="bg-[#1e1e1e] border border-gray-800 rounded-[30px] p-6 lg:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* Foto de Perfil */}
          <div className="relative">
            <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800">
              <img
                src={user?.foto ? getBase64ImageSrc(user.foto) : '/assets/default-avatar.png'}
                alt="Foto Estudiante"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Datos Personales */}
          <div className="flex-1 text-center lg:text-left space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight">{user?.persona}</h1>
            <p className="text-[#fff] text-xl font-medium">{user?.numero_control}</p>
            <p className="text-gray-400 text-lg">Ing. Sistemas Computacionales</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-sm text-gray-500">
              <div><span className="block font-bold text-gray-300">Semestre</span> {user?.semestre}</div>
              <div><span className="block font-bold text-gray-300">Sede</span> Celaya</div>
              <div><span className="block font-bold text-gray-300">Estatus</span> Vigente Reingreso</div>
              <div><span className="block font-bold text-gray-300">Créditos Complementarios</span> {user?.creditos_complementarios}</div>
            </div>
          </div>
        </div>

        {/* Barra de Progreso (Avance) */}
        <div className="mt-10 space-y-3">
          <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-gray-400">
            <span>Porcentaje de avance</span>
            <span>{ user?.porcentaje_avance ? `${user?.porcentaje_avance}%` : '--%'}</span> {/* Ajusta según tu lógica de créditos */}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <div
              className="bg-[#c6538c] h-full rounded-full transition-all duration-1000"
              style={{ width: `${user?.porcentaje_avance}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. GRID DE ESTADÍSTICAS (Tarjetas pequeñas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          label="Créditos acumulados"
          value= {`${user?.creditos_acumulados}`}
          icon={BatteryChargingFullIcon}
        />

        <StatCard
          label="Materias reprobadas"
          value=  {`${user?.materias_reprobadas}`}
          icon={ThumbDownIcon}
        />

        <StatCard
          label="Materias aprobadas"
          value= {`${user?.materias_aprobadas}`}
          icon={ThumbUpIcon}
        />

        <StatCard
          label="Promedio general"
          value= {Number(user?.promedio_ponderado ?? 0).toFixed(3)}
          icon={AssignmentIcon}
        />

      </div>
      {/* 3. SECCIÓN DE ACCESOS RÁPIDOS */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400 ml-2">Opciones</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuOption icon="🕒" label="Horario" href="/horario" />
          <MenuOption icon="📝" label="Calificaciones" href="/calificaciones" />
          <MenuOption icon="📜" label="Kardex" href="/kardex" />
          <MenuOption icon="👥" label="Profesores" href="/profesores" />
          <MenuOption icon="👤" label="Datos del estudiante" href="" />
          <MenuOption icon="✍️" label="Evaluación Docente" href="" />
        </div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENTES PARA ORGANIZACIÓN ---

 function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="bg-[#7a3049] border border-[#8a3d58] rounded-[25px] p-6 flex items-center gap-6 shadow-lg transition-transform hover:scale-[1.02]">
      <div className="flex-shrink-0">
        {/* Renderizamos el componente Icon con estilos de Material UI */}
        <Icon sx={{ fontSize: 48, color: 'white' }} />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-gray-200 text-sm font-medium leading-tight mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}

function MenuOption({ icon, label, href }: { icon: string, label: string, href: string }) {
  return (
    <a
      href={href}
      className="bg-[#1e1e1e] border border-gray-800 rounded-[30px] p-8 flex flex-col items-center justify-center gap-4 hover:bg-[#252525] hover:border-[#c6538c]/50 transition-all group"
    >
      <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-bold uppercase tracking-widest text-center text-gray-300 group-hover:text-white">
        {label}
      </span>
    </a>
  );
}
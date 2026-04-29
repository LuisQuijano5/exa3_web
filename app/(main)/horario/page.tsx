'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/common/Spinner';
import { getHorarios } from '@/services/api';
import { HorarioPeriodo } from '@/types/api';

// ── Configuración de días ────────────────────────────────────────────────────
const DAYS = [
  { key: 'lunes',     salonKey: 'lunes_clave_salon',     label: 'Lunes' },
  { key: 'martes',    salonKey: 'martes_clave_salon',    label: 'Martes' },
  { key: 'miercoles', salonKey: 'miercoles_clave_salon', label: 'Miércoles' },
  { key: 'jueves',    salonKey: 'jueves_clave_salon',    label: 'Jueves' },
  { key: 'viernes',   salonKey: 'viernes_clave_salon',   label: 'Viernes' },
] as const;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HorarioPage() {
  const [data, setData] = useState<HorarioPeriodo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHorarios()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-[#1a1a1a] min-h-screen">
        <Spinner className="h-12 w-12 text-[#c6538c]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-rose-400 font-semibold bg-[#1a1a1a] min-h-screen">{error}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-32 bg-[#1a1a1a] min-h-screen">
        <p className="text-gray-500">Sin horario disponible para este período.</p>
      </div>
    );
  }

  const periodo = data[0];
  const horario = periodo.horario;

  // 1. Calcular la hora mínima y máxima de todas las clases para crear la tabla
  let minHour = 24;
  let maxHour = 0;

  horario.forEach((c) => {
    DAYS.forEach((d) => {
      const timeStr = (c as any)[d.key] as string | null;
      if (timeStr) {
        // timeStr viene como "11:00-13:00", lo partimos y sacamos los números
        const [startStr, endStr] = timeStr.split('-');
        const start = parseInt(startStr.split(':')[0], 10);
        const end = parseInt(endStr.split(':')[0], 10);
        
        if (start < minHour) minHour = start;
        if (end > maxHour) maxHour = end;
      }
    });
  });

  // Fallback para la hora de inicio por si no hay clases, o si empieza muy tarde
  if (minHour === 24) minHour = 7;
  
  // 🔥 AQUÍ ESTÁ EL CAMBIO 🔥
  // Forzamos a que la tabla siempre termine mínimo a las 19:00 hrs
  // Esto garantiza que siempre aparezcan las filas 17-18 y 18-19
  if (maxHour < 19) maxHour = 19;

  // 2. Crear los bloques de exactamente 1 hora
  const hourlySlots = [];
  for (let h = minHour; h < maxHour; h++) {
    hourlySlots.push({
      startHour: h,
      endHour: h + 1,
    });
  }

  // Helper para pintar la hora dividida en 2 líneas
  const formatTime = (startH: number, endH: number) => {
    return (
      <>
        {startH}:00-<br />
        {endH}:00
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#141414] p-6 sm:p-10 text-white font-sans">
      
      {/* Título de la sección */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          TU HORARIO ACADÉMICO
        </h1>
      </div>

      {/* Contenedor principal de la tabla */}
      <div className="max-w-6xl mx-auto bg-[#232323] border border-[#c6538c]/40 rounded-[32px] p-8 overflow-x-auto shadow-2xl">
        <div className="min-w-[800px]">
          
          {/* Cabeceras de los días */}
          <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-4 mb-6">
            <div></div> {/* Espacio vacío para la columna de horas */}
            {DAYS.map((day) => (
              <div key={day.key} className="text-center text-gray-200 font-medium">
                {day.label}
              </div>
            ))}
          </div>

          {/* Filas: Se itera por cada hora generada */}
          <div className="flex flex-col gap-3">
            {hourlySlots.map((slot) => (
              <div key={slot.startHour} className="grid grid-cols-[120px_repeat(5,1fr)] gap-4">
                
                {/* Columna de Hora + Icono Azul */}
                <div className="flex items-center gap-3 pr-2">
                  <div className="text-[11px] text-gray-300 font-medium text-right leading-tight w-10">
                    {formatTime(slot.startHour, slot.endHour)}
                  </div>
                  
                  {/* Icono de usuario azul constante */}
                  <div className="w-[42px] h-[42px] rounded-2xl bg-gradient-to-b from-[#4facfe] to-[#00f2fe] flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Celdas de días para la hora actual */}
                {DAYS.map((day) => {
                  const clase = horario.find((c) => {
                    const timeStr = (c as any)[day.key] as string | null;
                    if (!timeStr) return false;
                    
                    const [s, e] = timeStr.split('-');
                    const cStart = parseInt(s.split(':')[0], 10);
                    const cEnd = parseInt(e.split(':')[0], 10);
                    
                    return (slot.startHour >= cStart && slot.endHour <= cEnd);
                  });

                  if (clase) {
                    const salon = (clase as any)[day.salonKey] as string | null;

                    return (
                      <div
                        key={`${day.key}-${slot.startHour}`}
                        className="bg-[#653e50] border border-[#7a4b60] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm"
                      >
                        <span className="text-[11px] font-semibold text-white uppercase leading-tight mb-1">
                          {clase.nombre_materia}
                        </span>
                        <span className="text-[10px] text-gray-200 leading-tight">
                          Grupo {(clase as any).letra_grupo} • {clase.clave_materia}
                        </span>
                        <span className="text-[10px] text-gray-300 mt-1">
                          {salon ? `Aula ${salon}` : 'Sin Aula'}
                        </span>
                      </div>
                    );
                  }

                  // Celda vacía para rellenar el grid
                  return (
                    <div
                      key={`${day.key}-${slot.startHour}`}
                      className="bg-[#3b2731] border border-[#4a313d]/50 rounded-2xl"
                    />
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
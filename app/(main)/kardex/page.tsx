'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/common/Spinner';
import { getKardex } from '@/services/api';
import { KardexData, MateriaKardex } from '@/types/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const SEMESTRE_LABELS: Record<number, string> = {
  1: '1er Semestre', 2: '2do Semestre', 3: '3er Semestre',
  4: '4to Semestre',  5: '5to Semestre', 6: '6to Semestre',
  7: '7mo Semestre',  8: '8vo Semestre', 9: '9no Semestre',
};

// Colores de calificación similares a la imagen
const getCalifTextColor = (val: string | null) => {
  if (!val || val === 'NA' || val === '-') return 'text-gray-500';
  const n = parseFloat(val);
  if (n >= 90) return 'text-emerald-400';
  if (n >= 70) return 'text-yellow-400';
  return 'text-rose-500';
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function KardexPage() {
  const [data, setData] = useState<KardexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [semestreFiltro, setSemestreFiltro] = useState<number | 'all'>('all');

  useEffect(() => {
    getKardex()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-[#141414] min-h-screen">
        <Spinner className="h-12 w-12 text-[#c6538c]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-rose-400 font-semibold bg-[#141414] min-h-screen">{error}</div>;
  }

  if (!data) return null;

  const semestres = [...new Set(data.kardex.map((m) => m.semestre))].sort((a, b) => a - b);

  const filtradas = data.kardex.filter((m) => {
    const matchSearch =
      m.nombre_materia.toLowerCase().includes(search.toLowerCase()) ||
      m.clave_materia.toLowerCase().includes(search.toLowerCase());
    const matchSem = semestreFiltro === 'all' || m.semestre === semestreFiltro;
    return matchSearch && matchSem;
  });

  // Agrupar por semestre para la vista
  const porSemestre: Record<number, MateriaKardex[]> = {};
  filtradas.forEach((m) => {
    if (!porSemestre[m.semestre]) porSemestre[m.semestre] = [];
    porSemestre[m.semestre].push(m);
  });

  // Estadísticas globales
  const promedioGlobal =
    data.kardex.length > 0
      ? (
          data.kardex.reduce((acc, m) => acc + parseFloat(m.calificacion || '0'), 0) /
          data.kardex.length
        ).toFixed(1)
      : null;

  const aprobadas = data.kardex.filter((m) => parseFloat(m.calificacion) >= 70).length;
  const creditosTotal = data.kardex.reduce((acc, m) => acc + parseFloat(m.creditos || '0'), 0);

  return (
    <div className="min-h-screen bg-[#141414] p-6 sm:p-10 text-white font-sans">
      
      {/* Título */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-medium uppercase tracking-wide">
          KARDEX
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Historial Académico
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Stat cards (Diseño adaptado a tus stats de "Calificaciones") */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#232323] rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-md">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Avance</p>
            <p className="text-3xl font-bold text-white">{data.porcentaje_avance}%</p>
          </div>
          
          <div className="bg-[#232323] rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-md">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Promedio</p>
            <p className={`text-3xl font-bold ${getCalifTextColor(promedioGlobal)}`}>{promedioGlobal ?? '—'}</p>
          </div>

          <div className="bg-[#232323] rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-md">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Aprobadas</p>
            <p className="text-3xl font-bold text-emerald-400">{aprobadas}</p>
          </div>

          <div className="bg-[#232323] rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-md">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Créditos</p>
            <p className="text-3xl font-bold text-gray-300">{creditosTotal}</p>
          </div>
        </div>

        {/* Filtros simplificados */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar materia o clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm bg-[#232323] border border-transparent text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#c6538c] transition-colors placeholder-gray-500"
          />
          <select
            value={semestreFiltro}
            onChange={(e) =>
              setSemestreFiltro(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="w-full sm:max-w-[200px] bg-[#232323] border border-transparent text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#c6538c] transition-colors cursor-pointer appearance-none"
          >
            <option value="all">Todos los semestres</option>
            {semestres.map((s) => (
              <option key={s} value={s}>
                {SEMESTRE_LABELS[s] ?? `Semestre ${s}`}
              </option>
            ))}
          </select>
        </div>

        {/* Tarjetas agrupadas por Semestre */}
        {Object.keys(porSemestre).length === 0 ? (
          <p className="text-center py-16 text-gray-500">No se encontraron materias.</p>
        ) : (
          Object.entries(porSemestre)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([sem, materias]) => (
              <div key={sem} className="mb-12">
                
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">
                  {SEMESTRE_LABELS[parseInt(sem)] ?? `Semestre ${sem}`}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materias.map((m, i) => (
                    <div 
                      key={`${m.clave_materia}-${i}`} 
                      className="bg-[#232323] rounded-xl overflow-hidden shadow-lg flex flex-col"
                    >
                      {/* Cabecera Rosa (Igual que en Calificaciones) */}
                      <div className="bg-[#cc5a8d] min-h-[80px] p-4 flex items-center justify-center text-center">
                        <h3 className="text-white font-bold uppercase text-sm leading-snug">
                          {m.nombre_materia}
                        </h3>
                      </div>

                      {/* Cuerpo Oscuro */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="mb-6">
                          <p className="text-[11px] font-bold text-white uppercase tracking-widest mb-2">
                            Detalles
                          </p>
                          <p className="text-sm text-gray-400 font-mono mb-1">{m.clave_materia}</p>
                          <p className="text-xs text-gray-500">Créditos: {m.creditos}</p>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-white uppercase tracking-widest mb-2">
                            Calificación Final
                          </p>
                          <div className="flex items-end gap-2">
                            <span className={`text-4xl font-bold leading-none ${getCalifTextColor(m.calificacion)}`}>
                              {m.calificacion}
                            </span>
                            <span className="text-xs text-gray-500 mb-1">/ 100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/common/Spinner';
import { getCalificaciones } from '@/services/api';
import { CalificacionesPeriodo, MateriaCalificacion } from '@/types/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const calcPromedio = (materia: MateriaCalificacion): string | null => {
  const registradas = (materia.calificaiones ?? []).filter((c) => c.calificacion !== null);
  if (registradas.length === 0) return null;
  const prom =
    registradas.reduce((acc, c) => acc + parseFloat(c.calificacion!), 0) / registradas.length;
  return prom.toFixed(1);
};

const getGradeColor = (grade: string | null) => {
  if (!grade) return 'text-gray-400';
  const n = parseFloat(grade);
  if (n >= 90) return 'text-emerald-400';
  if (n >= 70) return 'text-amber-400';
  return 'text-rose-400';
};

const PARCIALES = [1, 2, 3, 4];

// ── Tarjeta de materia ────────────────────────────────────────────────────────
function MateriaCard({
  materia,
  nombre,
}: {
  materia: MateriaCalificacion;
  nombre: string;
}) {
  const califs = materia.calificaiones ?? [];

  return (
    <div className="bg-[#2a2a2a] rounded-lg overflow-hidden flex flex-col">
      {/* Header rosa con nombre de materia */}
      <div className="bg-[#c6538c] px-5 py-6 flex items-center justify-center min-h-[90px]">
        <h3 className="text-white font-bold text-base text-center uppercase leading-tight tracking-wide">
          {materia.materia.nombre_materia}
        </h3>
      </div>

      {/* Cuerpo */}
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Info */}
        <div>
          <p className="text-white text-xs font-semibold uppercase tracking-wide">{nombre}</p>
          <p className="text-gray-400 text-xs mt-0.5">{materia.materia.clave_materia}</p>
          <p className="text-gray-400 text-xs">Grupo: {materia.materia.letra_grupo}</p>
        </div>

        {/* Parciales */}
        <div>
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Calificaciones
          </p>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 text-[10px] pt-px whitespace-nowrap">Parciales</span>
            <div className="flex flex-col flex-1 gap-0.5">
              {/* Números de parcial */}
              <div className="flex">
                {PARCIALES.map((num) => (
                  <span key={num} className="flex-1 text-center text-gray-400 text-[11px] font-medium">
                    {num}
                  </span>
                ))}
              </div>
              {/* Calificaciones */}
              <div className="flex">
                {PARCIALES.map((num) => {
                  const calif = califs.find((c) => c.numero_calificacion === num);
                  const grade = calif?.calificacion ?? null;
                  return (
                    <span
                      key={num}
                      className={`flex-1 text-center text-sm font-bold ${getGradeColor(grade)}`}
                    >
                      {grade ?? '–'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CalificacionesPage() {
  const [data, setData] = useState<CalificacionesPeriodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [periodoKey, setPeriodoKey] = useState('');
  const [nombreEstudiante, setNombreEstudiante] = useState('ESTUDIANTE');

  useEffect(() => {
    // Intentar leer el nombre cacheado (el dashboard lo guarda al cargar el perfil)
    const cached = localStorage.getItem('student_name');
    if (cached) setNombreEstudiante(cached);

    getCalificaciones()
      .then((d) => {
        setData(d);
        if (d.length > 0) setPeriodoKey(d[0].periodo.clave_periodo);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const periodoActual = data.find((p) => p.periodo.clave_periodo === periodoKey);
  const materias = periodoActual?.materias ?? [];

  const materiasFiltradas = materias.filter(
    (m) =>
      m.materia.nombre_materia.toLowerCase().includes(search.toLowerCase()) ||
      m.materia.clave_materia.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const promedioGlobal = (() => {
    const vals = materias
      .map((m) => calcPromedio(m))
      .filter((v): v is string => v !== null)
      .map(parseFloat);
    if (vals.length === 0) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  })();

  const aprobadas = materias.filter((m) => {
    const p = calcPromedio(m);
    return p !== null && parseFloat(p) >= 70;
  }).length;

  const sinCalificar = materias.filter((m) => calcPromedio(m) === null).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner className="h-12 w-12 text-[#c6538c]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-rose-400 font-semibold">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 text-white">

      {/* Título + selector de periodo */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">CALIFICACIONES</h1>
          <p className="text-gray-500 text-sm mt-1">
            {periodoActual?.periodo.descripcion_periodo ?? ''}
          </p>
        </div>
        {data.length > 1 && (
          <select
            value={periodoKey}
            onChange={(e) => setPeriodoKey(e.target.value)}
            className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#c6538c] transition-colors cursor-pointer appearance-none"
          >
            {data.map((p) => (
              <option key={p.periodo.clave_periodo} value={p.periodo.clave_periodo}>
                {p.periodo.descripcion_periodo}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Materias</p>
          <p className="text-3xl font-bold text-white">{materias.length}</p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Promedio</p>
          <p className={`text-3xl font-bold ${getGradeColor(promedioGlobal)}`}>
            {promedioGlobal ?? '—'}
          </p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Aprobadas</p>
          <p className="text-3xl font-bold text-emerald-400">{aprobadas}</p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Sin calificar</p>
          <p className="text-3xl font-bold text-gray-400">{sinCalificar}</p>
        </div>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar materia o clave..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-80 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c6538c] transition-colors placeholder-gray-500"
      />

      {/* Grid de tarjetas */}
      {materiasFiltradas.length === 0 ? (
        <p className="text-center py-16 text-gray-600">No se encontraron materias.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materiasFiltradas.map((m) => (
            <MateriaCard
              key={m.materia.id_grupo}
              materia={m}
              nombre={nombreEstudiante}
            />
          ))}
        </div>
      )}
    </div>
  );
}
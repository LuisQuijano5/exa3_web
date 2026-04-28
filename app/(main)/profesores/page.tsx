'use client';

import React, { useEffect, useState } from 'react';
import TeacherCard from '@/components/profesores/TeacherCard';
import TeacherDetailsModal from '@/components/profesores/TeacherDetailsModal';
import { Teacher } from '@/types/api';
import { Spinner } from '@/components/common/Spinner';
import { getTeachersList } from '@/services/api';

export default function ProfesoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getTeachersList(1, 20, search, department);
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la lista de profesores.');
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, department]);

  const handleCardClick = (teacher: Teacher) => {
    setSelectedTeacherId(teacher.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
          PROFESORES <span className="text-[#c6538c] font-normal">/ EVALUACIONES</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a222f] text-white border border-gray-700 rounded-lg px-4 py-3 w-full sm:w-1/2 focus:outline-none focus:border-[#c6538c] transition-colors placeholder-gray-500"
        />
        
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-[#1a222f] text-white border border-gray-700 rounded-lg px-4 py-3 w-full sm:w-1/3 focus:outline-none focus:border-[#c6538c] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Todos los departamentos</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Industrial">Ingeniería Industrial</option>
          <option value="Mecatronica">Mecatrónica</option>
          <option value="Gestion">Gestión Empresarial</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="h-12 w-12 text-[#c6538c]" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400 font-semibold">{error}</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No se encontraron profesores con los filtros actuales.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      <TeacherDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacherId={selectedTeacherId}
      />
    </div>
  );
}
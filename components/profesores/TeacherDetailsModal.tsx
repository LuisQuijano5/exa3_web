import React, { useEffect, useState } from 'react';
import { Teacher, Evaluation } from '@/types/api';
import { Spinner } from '@/components/common/Spinner';
import { getTeacherStats, getTeacherEvals } from '../../services/api';

interface TeacherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string | null;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({ isOpen, onClose, teacherId }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && teacherId) {
      setLoading(true);
      
      const fetchModalData = async () => {
        try {
          const [statsData, evalsResponse] = await Promise.all([
            getTeacherStats(teacherId),
            getTeacherEvals(teacherId, 1, 10) 
          ]);

          setTeacher(statsData);
          setEvaluations(evalsResponse.data); 
        } catch (error) {
          console.error("Error cargando detalles del profe:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchModalData();
    } else {
      setTeacher(null);
      setEvaluations([]);
    }
  }, [isOpen, teacherId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="bg-[#1f2937] rounded-xl max-w-4xl w-full relative border border-gray-600 shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1f2937] z-10 rounded-t-xl">
          <h2 className="text-2xl font-bold text-white uppercase">Detalles del Docente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
             <div className="text-center py-10 text-white">Cargando detalles...</div>
          ) : teacher ? (
            <div className="flex flex-col gap-8">
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                   {teacher.photo_url ? (
                     <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full rounded-2xl object-cover" />
                   ) : (
                     <span className="text-4xl font-bold text-white">{teacher.name.charAt(0)}</span>
                   )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-bold text-white uppercase">{teacher.name}</h3>
                  <p className="text-gray-400 mt-1">{teacher.email}</p>
                  <span className="inline-block bg-[#9d446e] text-white text-sm px-4 py-1 rounded-full mt-3">
                    {teacher.department}
                  </span>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center min-w-[120px]">
                  <p className="text-gray-400 text-sm">Calificación</p>
                  <p className="text-4xl font-bold text-white">{teacher.average_grade}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Total Evals.</p>
                  <p className="text-2xl font-bold text-white">{teacher.evaluation_count}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Prom. Alumnos</p>
                  <p className="text-2xl font-bold text-[#b85b89]">{teacher.avg_student_grade}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center flex flex-col justify-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Modalidades</p>
                  <div className="flex justify-center gap-2 text-xs">
                    <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded">Reg: {teacher.regular_count}</span>
                    <span className="bg-yellow-900/50 text-yellow-400 px-2 py-1 rounded">Rep: {teacher.repeticion_count}</span>
                   <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded">Esp: {teacher.especial_count}</span>
                  </div>
                </div>
                
              </div>

              <div className="mt-4">
                <h4 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Comentarios de Alumnos</h4>
                
                {evaluations.length === 0 ? (
                  <p className="text-gray-500">Sin evaluaciones registradas.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {evaluations.map((ev) => (
                      <div key={ev.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-bold uppercase mr-2">{ev.subject || 'Sin Materia'}</span>
                            <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                              ev.modality === 'regular' ? 'bg-green-900/50 text-green-400' :
                              ev.modality === 'repeticion' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'
                            }`}>
                              {ev.modality || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-sm text-gray-400">Calificó con:</span>
                             <span className="text-xl font-bold text-white bg-gray-900 px-2 py-1 rounded">{ev.grade}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 italic">"{ev.comment}"</p>
                        
                        <div className="text-right text-sm text-gray-500">
                          Calificación del alumno: <span className="font-bold text-gray-300">{ev.student_grade || '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
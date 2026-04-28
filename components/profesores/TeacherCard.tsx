import React from 'react';
import { Teacher } from '@/types/api';

interface TeacherCardProps {
  teacher: Teacher;
  onClick: (teacher: Teacher) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onClick }) => {
  return (
    <div
      className="bg-[#1f2937] rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-black/50 transition-all cursor-pointer flex flex-col gap-4 border border-gray-700 hover:border-gray-500"
      onClick={() => onClick(teacher)}
    >
      <div className="flex items-center gap-4">
        {teacher.photo_url ? (
           <img src={teacher.photo_url} alt={teacher.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {teacher.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold text-white uppercase">{teacher.name}</h3>
          <div className="flex gap-2 mt-2">
            <span className="inline-block bg-[#9d446e] text-white text-xs px-3 py-1 rounded-full">
              {teacher.department}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
        <div>
          <span className="font-semibold text-white">Calificación:</span> {teacher.average_grade}
        </div>
        <div>
          <span className="text-gray-400">{teacher.evaluation_count} evaluaciones</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
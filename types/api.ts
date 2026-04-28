export interface LoginResponse {
  responseCodeTxt: string;
  message: {
    login: {
      token: string;
    };
  };
  status: number;
  flag: string;
  data: number;
  type: string;
}

export interface EstudianteResponse {
  code: number;
  message: string;
  flag: boolean;
  data: Estudiante; 
}

export interface Estudiante {
  numero_control: string;
  persona: string;
  email: string;
  semestre: number;
  num_mat_rep_no_acreditadas: string;
  creditos_acumulados: string; 
  promedio_ponderado: string;
  promedio_aritmetico: string;
  materias_cursadas: string;
  materias_reprobadas: string;
  materias_aprobadas: string;
  creditos_complementarios: number;
  porcentaje_avance: number;
  num_materias_rep_primera: string | null;
  num_materias_rep_segunda: string | null;
  percentaje_avance_cursando: number;
  foto: string; 
}

//Aqui ya modularice jiji, lo de estudiante se puede ajustar para que use esta tmb pero yaa
export interface ApiResponse<T> {
  code: number;
  message: string;
  flag: boolean;
  data: T;
}

// --- KARDEX ---
export interface MateriaKardex {
  nombre_materia: string;
  clave_materia: string;
  periodo: string;
  creditos: string;
  calificacion: string;
  descripcion: string;
  semestre: number;
}

export interface KardexData {
  porcentaje_avance: number;
  kardex: MateriaKardex[];
}

// --- HORARIOS ---
export interface PeriodoInfo {
  clave_periodo: string;
  anio: number;
  descripcion_periodo: string;
}

export interface ClaseHorario {
  id_grupo: number;
  nombre_materia: string;
  clave_materia: string;
  lunes: string | null;
  lunes_clave_salon: string | null;
  martes: string | null;
  martes_clave_salon: string | null;
  miercoles: string | null;
  miercoles_clave_salon: string | null;
  jueves: string | null;
  jueves_clave_salon: string | null;
  viernes: string | null;
  viernes_clave_salon: string | null;
}

export interface HorarioPeriodo {
  periodo: PeriodoInfo;
  horario: ClaseHorario[];
}

export interface CalificacionParcial {
  id_calificacion: number;
  numero_calificacion: number;
  calificacion: string | null;
}

export interface MateriaCalificacion {
  materia: {
    id_grupo: number;
    nombre_materia: string;
    clave_materia: string;
    letra_grupo: string;
  };
  calificaiones: CalificacionParcial[]; 
}

export interface CalificacionesPeriodo {
  periodo: PeriodoInfo;
  materias: MateriaCalificacion[];
}


// === FUNCIONALIDAD EXTRA ===
// types/teacher.ts

// types/teacher.ts

export interface Evaluation {
  id: string;
  teacher_id: string;
  grade: number;
  comment: string | null;
  subject: string | null;
  student_grade: number | null;
  modality: 'regular' | 'repeticion' | 'especial' | null;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  photo_url: string | null;
  average_grade: number;
  evaluation_count: number;
  avg_student_grade: number;
  regular_count: number;
  repeticion_count: number;
  especial_count: number;
}

export interface PaginatedTeachers {
  data: Teacher[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedEvaluations {
  data: Evaluation[];
  total: number;
  page: number;
  limit: number;
}
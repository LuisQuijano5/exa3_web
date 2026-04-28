import { 
  LoginResponse, 
  EstudianteResponse, 
  Estudiante, 
  ApiResponse, 
  KardexData, 
  HorarioPeriodo, 
  CalificacionesPeriodo } from '../types/api';

const BASE_URL = '/tecnm-api';

// Para verificar si el navegador tiene el token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

// Este lo dejo asi generico por si lo quieren usar o pruebas pero no creo que lo usen por lo de tipos
const fetchWithAuth = async (endpoint: string) => {
  const token = getToken();
  if (!token) throw new Error('No hay sesión activa');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error(`Error en la petición: ${response.statusText}`);
  return response.json();
};

// ==========================================
// ENDPOINTS
// ==========================================

export const loginAPI = async (email: string, password: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const json: LoginResponse = await response.json();
  
  if (json.status !== 200 || !json.message?.login?.token) {
    throw new Error('Credenciales incorrectas o error en el servidor');
  }
  
  return json.message.login.token; 
};

export const getPerfilEstudiante = async (): Promise<Estudiante> => {
  const json: EstudianteResponse = await fetchWithAuth('/api/movil/estudiante');
  
  if (!json.flag) {
    throw new Error(json.message || 'Error al obtener perfil');
  }

  return json.data; 
};

export const getKardex = async (): Promise<KardexData> => {
  const json: ApiResponse<KardexData> = await fetchWithAuth('/api/movil/estudiante/kardex');
  return json.data;
};

export const getHorarios = async (): Promise<HorarioPeriodo[]> => {
  const json: ApiResponse<HorarioPeriodo[]> = await fetchWithAuth('/api/movil/estudiante/horarios');
  return json.data;
};

export const getCalificaciones = async (): Promise<CalificacionesPeriodo[]> => {
  const json: ApiResponse<CalificacionesPeriodo[]> = await fetchWithAuth('/api/movil/estudiante/calificaciones');
  return json.data;
};
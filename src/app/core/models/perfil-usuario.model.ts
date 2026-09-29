export interface PerfilUsuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  grupo_sanguineo?: string;
  color_ojos?: string;
  dias_vacaciones?: number;
  rol: 'cliente' | 'empleado' | 'administrador';
  puntos_fidelizacion: number;
  credito_cuenta: number;
}
export interface Funcion {
  id: string;
  pelicula_id: string;
  sala_id: string;
  fecha_hora: string;
  precio_base: number;
  precio_preventa: number | null;
  fin_preventa: string | null;
  peliculas?: { nombre: string; duracion_min: number; restriccion_edad: number | null };
}
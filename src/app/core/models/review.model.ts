export interface Review {
  id: string;
  pelicula_id: string;
  usuario_id: string;
  puntuacion: number;
  comentario: string;
  creado_en: string;
}
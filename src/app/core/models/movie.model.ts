export interface Movie {
  id: string;
  nombre: string;
  sinopsis: string;
  duracion_min: number;
  imagen_url: string;
  restriccion_edad: number | null;
  fecha_estreno: string;
  formatos: string[];
  idiomas: string[];
  pelicula_generos?: { generos: { nombre: string } }[];
}
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(private supabase: SupabaseService) {}

  async listar(filtro?: { texto?: string; genero?: string }) {
    let query = this.supabase.client
      .from('peliculas')
      .select('*, pelicula_generos(generos(nombre))');

    if (filtro?.texto) query = query.ilike('nombre', `%${filtro.texto}%`);
        const { data, error } = await query;
    if (error) throw error;

    let peliculas = data as any[];
    if (filtro?.genero) {
      peliculas = peliculas.filter(p =>
        p.pelicula_generos.some((pg: any) => pg.generos.nombre === filtro.genero)
      );
    }
    return peliculas;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await this.supabase.client
      .from('peliculas').select('*, pelicula_generos(generos(nombre))').eq('id', id).single();
    if (error) throw error;
    return data;
  }
}
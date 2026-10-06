import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class FuncionesService {
  constructor(private supabase: SupabaseService) {}

  async listarPorPelicula(peliculaId: string) {
    const { data, error } = await this.supabase.client
      .from('funciones')
      .select('*, peliculas(nombre, duracion_min, restriccion_edad)')
      .eq('pelicula_id', peliculaId)
      .gte('fecha_hora', new Date().toISOString())
      .order('fecha_hora');
    if (error) throw error;
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await this.supabase.client
      .from('funciones').select('*, peliculas(nombre, duracion_min, restriccion_edad)').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  precioVigente(funcion: { precio_base: number; precio_preventa: number | null; fin_preventa: string | null }) {
    const enPreventa = funcion.precio_preventa != null && funcion.fin_preventa && new Date(funcion.fin_preventa) > new Date();
    return enPreventa ? funcion.precio_preventa! : funcion.precio_base;
  }
}
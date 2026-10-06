import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CandyService {
  constructor(private supabase: SupabaseService) {}

  async listarProductos() {
    const { data, error } = await this.supabase.client
      .from('productos').select('*, categorias_producto(nombre)').order('categoria_id');
    if (error) throw error;
    return data;
  }

  async listarCombos() {
    const { data, error } = await this.supabase.client.from('combos').select('*');
    if (error) throw error;
    return data;
  }
}
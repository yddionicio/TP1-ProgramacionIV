import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CuponesService {
  constructor(private supabase: SupabaseService) {}

  async obtenerDescuentoPrimeraCompra(usuarioId: string): Promise<number> {
    const { count } = await this.supabase.client
      .from('compras').select('*', { count: 'exact', head: true }).eq('usuario_id', usuarioId);
    return count === 0 ? 0.20 : 0;
  }

  calcularEdad(fechaNacimiento: string): number {
    return Math.floor((Date.now() - new Date(fechaNacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }
}
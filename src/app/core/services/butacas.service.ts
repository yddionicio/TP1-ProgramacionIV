import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Butaca } from '../models/butaca.model';

@Injectable({ providedIn: 'root' })
export class ButacasService {
  // Identifica a este navegador/pestaña sin necesidad de login (compra anónima).
  sesionId = crypto.randomUUID();

  constructor(private supabase: SupabaseService) {}

  async listarPorSala(salaId: string) {
    const { data, error } = await this.supabase.client
      .from('butacas').select('*').eq('sala_id', salaId).order('fila').order('numero');
    if (error) throw error;
    return data as Butaca[];
  }

  async listarHolds(funcionId: string) {
    const { data, error } = await this.supabase.client
      .from('reservas_temporales').select('*').eq('funcion_id', funcionId).gt('expira_en', new Date().toISOString());
    if (error) throw error;
    return data;
  }

  async listarButacasOcupadas(funcionId: string) {
    const { data, error } = await this.supabase.client
      .from('entradas').select('butaca_id, compras!inner(funcion_id)').eq('compras.funcion_id', funcionId);
    if (error) throw error;
    return (data ?? []).map(e => e.butaca_id);
  }

  async tomarHold(funcionId: string, butacaId: string) {
    const { error } = await this.supabase.client
      .from('reservas_temporales')
      .insert({ funcion_id: funcionId, butaca_id: butacaId, sesion_id: this.sesionId });
    // 23505 = unique_violation: alguien más tomó esa butaca un instante antes.
    if (error) {
      if ((error as any).code === '23505') throw new Error('Esa butaca ya fue tomada por otra persona.');
      throw error;
    }
  }

  async soltarHold(funcionId: string, butacaId: string) {
    await this.supabase.client
      .from('reservas_temporales').delete()
      .eq('funcion_id', funcionId).eq('butaca_id', butacaId).eq('sesion_id', this.sesionId);
  }

  suscribirCambios(funcionId: string, callback: () => void) {
    return this.supabase.client
      .channel(`butacas-${funcionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas_temporales', filter: `funcion_id=eq.${funcionId}` }, callback)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'entradas' }, callback)
      .subscribe();
  }
}
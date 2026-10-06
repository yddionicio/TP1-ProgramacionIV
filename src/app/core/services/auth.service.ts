import { Injectable, signal } from '@angular/core';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { PerfilUsuario } from '../models/perfil-usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  usuarioActual = signal<PerfilUsuario | null>(null);

  constructor(private supabase: SupabaseService) {
    this.supabase.client.auth.onAuthStateChange((_evento: AuthChangeEvent, sesion: Session | null) => {
      if (sesion?.user) this.cargarPerfil(sesion.user.id);
      else this.usuarioActual.set(null);
    });
  }

  async registrar(email: string, password: string, datos: Partial<PerfilUsuario>) {
  const { data, error } = await this.supabase.client.auth.signUp({ email, password });
  if (error) throw error;

  if (!data.user) {
    throw new Error('No se pudo crear el usuario. Intentá nuevamente.');
  }

  const { error: errorPerfil } = await this.supabase.client
    .from('usuarios')
    .insert({ id: data.user.id, email, nombre: datos.nombre, apellido: datos.apellido, fecha_nacimiento: datos.fecha_nacimiento, grupo_sanguineo: datos.grupo_sanguineo, color_ojos: datos.color_ojos, dias_vacaciones: datos.dias_vacaciones ?? 0, rol: 'cliente', puntos_fidelizacion: 0, credito_cuenta: 0 });

  if (errorPerfil) throw errorPerfil;

  await this.cargarPerfil(data.user.id);
}

  /*
  async registrar(email: string, password: string, datos: Partial<PerfilUsuario>) {
    const { data, error } = await this.supabase.client.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await this.supabase.client.from('usuarios').insert({ id: data.user.id, email, nombre: datos.nombre, apellido: datos.apellido, fecha_nacimiento: datos.fecha_nacimiento, grupo_sanguineo: datos.grupo_sanguineo, color_ojos: datos.color_ojos, dias_vacaciones: datos.dias_vacaciones ?? 0, rol: 'cliente', puntos_fidelizacion: 0, credito_cuenta: 0 });
    }
  }*/

  async iniciarSesion(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async cerrarSesion() {
    await this.supabase.client.auth.signOut();
  }

  async cargarPerfil(usuarioId: string) {
    const { data } = await this.supabase.client.from('usuarios').select('*').eq('id', usuarioId).single();
    if (data) this.usuarioActual.set(data as PerfilUsuario);
  }

  async actualizarPerfil(cambios: Partial<PerfilUsuario>) {
    const id = this.usuarioActual()?.id;
    if (!id) return;
    const { error } = await this.supabase.client.from('usuarios').update(cambios).eq('id', id);
    if (error) throw error;
    await this.cargarPerfil(id);
  }
}
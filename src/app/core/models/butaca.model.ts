export interface Butaca {
  id: string;
  sala_id: string;
  fila: string;
  numero: number;
  tipo: 'normal' | 'accesible' | 'vip';
}
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AutenticacionService } from '../../../core/services/auth.service';
import { CuponesService } from '../../../core/services/cupones.service';
import { CandyService } from '../../../core/services/candy.service';
import { SupabaseService } from '../../../core/services/supabase.service';

interface ItemCarrito {
  tipo: 'producto' | 'combo';
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AutenticacionService);
  private cuponesService = inject(CuponesService);
  private candyService = inject(CandyService);
  private supabase = inject(SupabaseService);

  funcionId = this.route.snapshot.paramMap.get('funcionId')!;
  butacaIds = (this.route.snapshot.queryParamMap.get('butacas') ?? '').split(',').filter(Boolean);

  productos = signal<any[]>([]);
  combos = signal<any[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  descuento = signal(0);
  cuponAplicado = signal('');
  procesando = signal(false);

  async ngOnInit() {
    this.productos.set(await this.candyService.listarProductos());
    this.combos.set(await this.candyService.listarCombos());

    const usuario = this.auth.usuarioActual();
    if (usuario) {
      const d = await this.cuponesService.obtenerDescuentoPrimeraCompra(usuario.id);
      if (d > 0) {
        this.descuento.set(d);
        this.cuponAplicado.set('BIENVENIDA20');
      } else if (this.cuponesService.calcularEdad(usuario.fecha_nacimiento) >= 50) {
        this.descuento.set(0.15);
        this.cuponAplicado.set('MAYOR50');
      }
    }
  }

  agregarProducto(p: any) {
    this.carrito.update(c => [
      ...c,
      { tipo: 'producto', id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 },
    ]);
  }

  agregarCombo(c: any) {
    this.carrito.update(car => [
      ...car,
      { tipo: 'combo', id: c.id, nombre: c.nombre, precio: c.precio, cantidad: 1 },
    ]);
  }

  quitarItem(index: number) {
    this.carrito.update(c => c.filter((_, i) => i !== index));
  }

  subtotalEntradas() {
    return this.butacaIds.length * 3500;
  }

  subtotalCandy() {
    return this.carrito().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }

  total() {
    const bruto = this.subtotalEntradas() + this.subtotalCandy();
    return bruto * (1 - this.descuento());
  }

  async confirmarCompra() {
    this.procesando.set(true);
    try {
      const usuario = this.auth.usuarioActual();

      const { data: compra, error } = await this.supabase.client
        .from('compras')
        .insert({
          usuario_id: usuario?.id ?? null,
          funcion_id: this.funcionId,
          total: this.total(),
          descuento: this.descuento(),
          cupon_aplicado: this.cuponAplicado() || null,
        })
        .select()
        .single();
      if (error) throw error;

      for (const butacaId of this.butacaIds) {
        await this.supabase.client.from('entradas').insert({ compra_id: compra.id, butaca_id: butacaId });
        await this.supabase.client
          .from('reservas_temporales')
          .delete()
          .eq('funcion_id', this.funcionId)
          .eq('butaca_id', butacaId);
      }

      for (const item of this.carrito()) {
        await this.supabase.client.from('compra_productos').insert({
          compra_id: compra.id,
          producto_id: item.tipo === 'producto' ? item.id : null,
          combo_id: item.tipo === 'combo' ? item.id : null,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        });
      }

      this.router.navigate(['/compra/confirmacion', compra.id]);
    } catch (e: any) {
      alert('Error al procesar la compra: ' + e.message);
    } finally {
      this.procesando.set(false);
    }
  }
}
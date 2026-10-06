import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { EntradaPdfService } from '../../../core/services/entrada-pdf.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.scss',
})
export class ConfirmacionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  private pdfService = inject(EntradaPdfService);

  compra = signal<any>(null);

  async ngOnInit() {
    const compraId = this.route.snapshot.paramMap.get('compraId')!;
    const { data } = await this.supabase.client
      .from('compras')
      .select('*, funciones(fecha_hora, peliculas(nombre), salas(nombre)), entradas(butacas(fila, numero))')
      .eq('id', compraId)
      .single();
    this.compra.set(data);
  }

  descargarPdf() {
    const c = this.compra();
    this.pdfService.generar({
      pelicula: c.funciones.peliculas.nombre,
      sala: c.funciones.salas.nombre,
      fechaHora: c.funciones.fecha_hora,
      butacas: c.entradas.map((e: any) => `${e.butacas.fila}${e.butacas.numero}`),
      qrToken: c.qr_token,
      total: c.total,
    });
  }
}
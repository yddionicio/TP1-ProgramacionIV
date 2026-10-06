import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../../core/services/funciones.service';
import { Funcion } from '../../../core/models/funcion.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seleccion-funcion',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './seleccion-funcion.component.html',
  styleUrl: './seleccion-funcion.component.scss',
})
export class SeleccionFuncionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private funcionesService = inject(FuncionesService);

  funciones = signal<Funcion[]>([]);
  diaSeleccionado = signal<string | null>(null);

  dias = signal<string[]>([]);

  async ngOnInit() {
    const peliculaId = this.route.snapshot.paramMap.get('peliculaId')!;
    const data = await this.funcionesService.listarPorPelicula(peliculaId);
    this.funciones.set(data as Funcion[]);

    const diasUnicos = [...new Set(data.map(f => f.fecha_hora.slice(0, 10)))];
    this.dias.set(diasUnicos);
    this.diaSeleccionado.set(diasUnicos[0] ?? null);
  }

  funcionesDelDia() {
    return this.funciones().filter(f => f.fecha_hora.startsWith(this.diaSeleccionado() ?? ''));
  }

  elegir(funcionId: string) {
    this.router.navigate(['/compra', funcionId, 'butacas']);
  }

  precio(f: Funcion) {
    return this.funcionesService.precioVigente(f);
  }
}
import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButacasService } from '../../../core/services/butacas.service';
import { FuncionesService } from '../../../core/services/funciones.service';
import { Butaca } from '../../../core/models/butaca.model';

@Component({
  selector: 'app-mapa-butacas',
  standalone: true,
  templateUrl: './mapa-butacas.component.html',
})
export class MapaButacasComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private butacasService = inject(ButacasService);
  private funcionesService = inject(FuncionesService);

  funcionId = this.route.snapshot.paramMap.get('funcionId')!;
  butacas = signal<Butaca[]>([]);
  ocupadas = signal<string[]>([]);
  holdsAjenos = signal<string[]>([]);
  seleccionadas = signal<string[]>([]);
  canal: any;

  filas = computed(() => [...new Set(this.butacas().map(b => b.fila))].sort());

  async ngOnInit() {
    const funcion = await this.funcionesService.obtenerPorId(this.funcionId);
    this.butacas.set(await this.butacasService.listarPorSala(funcion.sala_id));
    await this.actualizarEstado();
    this.canal = this.butacasService.suscribirCambios(this.funcionId, () => this.actualizarEstado());
  }

  ngOnDestroy() {
    this.canal?.unsubscribe();
    // Si el usuario se va sin comprar, le liberamos las butacas que había tomado.
    this.seleccionadas().forEach(id => this.butacasService.soltarHold(this.funcionId, id));
  }

  async actualizarEstado() {
    this.ocupadas.set(await this.butacasService.listarButacasOcupadas(this.funcionId));
    const holds = await this.butacasService.listarHolds(this.funcionId);
    this.holdsAjenos.set(
      holds.filter(h => h.sesion_id !== this.butacasService.sesionId).map(h => h.butaca_id)
    );
  }

  butacasDeFila(fila: string) {
    return this.butacas().filter(b => b.fila === fila);
  }

  estaDisponible(id: string) {
    return !this.ocupadas().includes(id) && !this.holdsAjenos().includes(id);
  }

  async toggleButaca(butaca: Butaca) {
    if (!this.estaDisponible(butaca.id)) return;

    if (this.seleccionadas().includes(butaca.id)) {
      await this.butacasService.soltarHold(this.funcionId, butaca.id);
      this.seleccionadas.set(this.seleccionadas().filter(id => id !== butaca.id));
    } else {
      try {
        await this.butacasService.tomarHold(this.funcionId, butaca.id);
        this.seleccionadas.set([...this.seleccionadas(), butaca.id]);
      } catch (e: any) {
        alert(e.message); // otra persona la tomó un instante antes
        await this.actualizarEstado();
      }
    }
  }

  continuar() {
    this.router.navigate(['/compra', this.funcionId, 'candy'], {
      queryParams: { butacas: this.seleccionadas().join(',') },
    });
  }
}
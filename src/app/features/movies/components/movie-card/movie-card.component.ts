import { Component, Input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.component.html',
})
export class MovieCard {
  @Input({ required: true }) pelicula!: Movie;

  esEstreno = computed(() => {
    const dias = (Date.now() - new Date(this.pelicula.fecha_estreno).getTime()) / 86_400_000;
    return dias >= 0 && dias <= 14;
  });

  esPreventa = computed(() => new Date(this.pelicula.fecha_estreno).getTime() > Date.now());

  generosTexto = computed(() =>
    (this.pelicula.pelicula_generos ?? []).map(pg => pg.generos.nombre).join(', ')
  );
}
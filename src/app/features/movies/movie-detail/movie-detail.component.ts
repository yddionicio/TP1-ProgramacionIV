import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService } from '../../../core/services/movies.service';
import { Movie } from '../../../core/models/movie.model';
import { ReviewList } from '../components/review-list/review-list.component';
import { ReviewForm } from '../components/review-form/review-form.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterLink, ReviewList, ReviewForm],
  templateUrl: './movie-detail.component.html',
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);

  pelicula = signal<Movie | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.pelicula.set(await this.moviesService.obtenerPorId(id) as Movie);
  }
}
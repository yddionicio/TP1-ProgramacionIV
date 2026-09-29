import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { MovieCard } from '../components/movie-card/movie-card.component';
import { signal, computed } from '@angular/core';
import { OnInit } from '@angular/core';
import { Movie } from '../../../core/models/movie.model';
import { MovieSearch } from '../components/movie-search/movie-search.component';
import { MoviesService } from '../../../core/services/movies.service';

@Component({ selector: 'app-home', standalone: true, imports: [MovieCard, MovieSearch], templateUrl: './home.component.html' })
export class HomeComponent implements OnInit {
  peliculas = signal<Movie[]>([]);
  destacadas = signal<Movie[]>([]);
  cargando = signal(true);

  constructor(private moviesService: MoviesService) {}
  
async ngOnInit() {
  try {
    this.peliculas.set(await this.moviesService.listar());
    this.destacadas.set(this.peliculas().slice(0, 3));
  } catch (e) {
    console.error('Error cargando la cartelera:', e);
  } finally {
    this.cargando.set(false);
  }
}  
  
  async buscar(filtro: { texto?: string; genero?: string }) {
    this.peliculas.set(await this.moviesService.listar(filtro));
  }

  aplicarFiltro(filtro: { texto?: string; genero?: string }) {
    this.buscar(filtro);
  }
}
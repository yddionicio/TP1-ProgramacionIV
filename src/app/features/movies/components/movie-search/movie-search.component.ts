import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.scss'
})
export class MovieSearch {
  @Output() filtrar = new EventEmitter<{ texto?: string; genero?: string }>();

  generos = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia ficción', 'Animación'];
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    
    this.form = this.fb.group({ texto: [''], genero: [''] });

    this.form.valueChanges.subscribe(valor => 
      this.filtrar.emit(valor as { texto?: string; genero?: string })
    );
  }
}
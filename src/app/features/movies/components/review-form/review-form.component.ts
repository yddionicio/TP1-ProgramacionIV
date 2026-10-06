import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.component.html',
})
export class ReviewForm {
  private fb = inject(FormBuilder);

  @Output() enviar = new EventEmitter<{ puntuacion: number; comentario: string }>();

  form = this.fb.group({
    puntuacion: [0, [Validators.required, Validators.min(1)]],
    comentario: ['', [Validators.required, Validators.maxLength(300)]],
  });

  elegirPuntuacion(valor: number) {
    this.form.patchValue({ puntuacion: valor });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.enviar.emit(this.form.getRawValue() as { puntuacion: number; comentario: string });
    this.form.reset({ puntuacion: 0, comentario: '' });
  }
}
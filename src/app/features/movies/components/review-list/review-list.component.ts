import { Component, Input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './review-list.component.html',
})
export class ReviewList {
  @Input({ required: true }) resenas!: Review[];

  promedio = computed(() => {
    if (!this.resenas.length) return 0;
    return this.resenas.reduce((acc, r) => acc + r.puntuacion, 0) / this.resenas.length;
  });
}
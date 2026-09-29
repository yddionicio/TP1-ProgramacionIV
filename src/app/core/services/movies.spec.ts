import { TestBed } from '@angular/core/testing';
import { Movies } from './movies.service';

describe('Movies', () => {
  let service: Movies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Movies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

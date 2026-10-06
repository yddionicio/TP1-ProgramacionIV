import { TestBed } from '@angular/core/testing';
import { EntradaPdf } from './entrada-pdf.service';

describe('EntradaPdf', () => {
  let service: EntradaPdf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaPdf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

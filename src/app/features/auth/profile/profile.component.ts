import { Component, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AutenticacionService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  editando = false;
  usuario = computed(() => this.auth.usuarioActual());
  form: FormGroup;

  // Inyectamos los servicios y armamos el form dentro del constructor
  constructor(private fb: FormBuilder, private auth: AutenticacionService) {
    this.form = this.fb.group({
      nombre: [''],
      apellido: [''],
      gruposSanguineo: [''],
      colorOjos: [''],
      diasVacaciones: [0],
    });

    const u = this.usuario();
    if (u) {
      this.form.patchValue(u);
    }
  }

  async guardar() {
    // Usamos as any o un caseo seguro para evitar conflictos con los tipos nulos del formulario
    await this.auth.actualizarPerfil(this.form.getRawValue() as any);
    this.editando = false;
  }
}
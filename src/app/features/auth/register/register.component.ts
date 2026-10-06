import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../core/services/auth.service';

function mayorDe13(control: AbstractControl): ValidationErrors | null {
  const fecha = new Date(control.value);
  const edad = (Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return edad >= 13 ? null : { menorDe13: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  
  form: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AutenticacionService, 
    private router: Router
  ) {
    // Inicializamos el formulario dentro del constructor para que 'fb' ya esté disponible
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', [Validators.required, mayorDe13]],
      grupoSanguineo: [''],
      colorOjos: [''],
      diasVacaciones: [0],
    });
  }

  async onSubmit() {
  if (this.form.invalid) return;

  const { email, password, nombre, apellido, fechaNacimiento, grupoSanguineo, colorOjos, diasVacaciones } =
    this.form.getRawValue();

  try {
    await this.auth.registrar(email!, password!, {
      nombre: nombre!,
      apellido: apellido!,
      fecha_nacimiento: fechaNacimiento!,
      grupo_sanguineo: grupoSanguineo || undefined,
      color_ojos: colorOjos || undefined,
      dias_vacaciones: diasVacaciones ?? 0,
    });
    this.router.navigate(['/']);
  } catch (e: any) {
    this.errorMsg = this.traducirError(e);
  }
}

private traducirError(e: any): string {
  const msg = e?.message ?? '';
  if (msg.includes('rate limit')) {
    return 'Se alcanzó el límite de registros por ahora. Esperá unos minutos y volvé a intentar.';
  }
  if (msg.includes('already registered') || msg.includes('already exists')) {
    return 'Ese email ya tiene una cuenta. Probá iniciar sesión.';
  }
  if (msg.includes('Password')) {
    return 'La contraseña no cumple los requisitos mínimos de Supabase.';
  }
  return 'No se pudo completar el registro. Intentá de nuevo en unos minutos.';
}

 /* async onSubmit() {
    if (this.form.invalid) return;

    try {
      const { email, password, ...datos } = this.form.getRawValue();
      await this.auth.registrar(email!, password!, datos as any);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.errorMsg = e.message;
    }
  }*/
}
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  mensajeError = '';
  cargando = false;

  constructor(private fb: FormBuilder, private auth: AutenticacionService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async enviar() {
    if (this.form.invalid) return;
    this.mensajeError = '';
    this.cargando = true;

    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.iniciarSesion(email!, password!);
      this.router.navigate(['/peliculas']);
    } catch (e: any) {
      this.mensajeError = 'Email o contraseña incorrectos.';
    } finally {
      this.cargando = false;
    }
  }
}
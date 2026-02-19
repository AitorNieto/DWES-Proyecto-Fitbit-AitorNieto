import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // <--- 1. IMPORTAR ESTO
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // <--- 2. AÑADIRLO AQUÍ
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  // Cambiamos a public para que el HTML pueda acceder si fuera necesario
  public authService = inject(AuthService);

  email = '';
  name = '';
  password = '';
  passwordConfirm = '';

  onRegister() {
    if (this.password !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.name.trim() && this.email.trim() && this.password.trim()) {
      localStorage.setItem('userName', this.name);
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('userPassword', this.password);
      localStorage.setItem('isRegistered', 'true');
      
      this.authService.loginFitbit();
    }
  }
}
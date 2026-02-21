import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  public authService = inject(AuthService);

  email = '';
  name = '';
  password = '';
  passwordConfirm = '';
  public showPassword = false;
  public showPasswordConfirm = false;

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }

  public togglePasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  onRegister() {
    // 1. Validación de coincidencia
    if (this.password !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // 2. Validación de longitud mínima (Requisito punto 2)
    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // 3. Proceso de registro si todo es válido
    if (this.name.trim() && this.email.trim() && this.password.trim()) {
      localStorage.setItem('userName', this.name);
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('userPassword', this.password);
      localStorage.setItem('isRegistered', 'true');
      
      this.authService.loginFitbit();
    }
  }
}
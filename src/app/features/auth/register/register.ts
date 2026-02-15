import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private authService = inject(AuthService);

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
      // Guardar el nombre de usuario y marcar como registrado
      localStorage.setItem('userName', this.name);
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('userPassword', this.password);
      localStorage.setItem('isRegistered', 'true');
      
      this.authService.loginFitbit();
    }
  }
}
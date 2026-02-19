import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);

  username = ''; 
  password = '';
  public showPassword = false;

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.username.trim() && this.password.trim()) {
      // Verificar si el usuario se ha registrado antes
      const isRegistered = localStorage.getItem('isRegistered');
      const registeredName = localStorage.getItem('userName');
      const registeredPassword = localStorage.getItem('userPassword');
      
      if (!isRegistered || !registeredName) {
        alert('Debes registrarte primero antes de iniciar sesión');
        return;
      }

      // Verificar que el nombre de login coincida con el registrado
      if (this.username.trim() !== registeredName) {
        alert('El usuario no está registrado. Debes registrarte primero.');
        return;
      }

      // Verificar que la contraseña coincida
      if (this.password !== registeredPassword) {
        alert('Contraseña incorrecta');
        return;
      }

      this.authService.loginFitbit();
    }
  }
}